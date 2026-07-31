'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Trade } from '@/data/types';
import { capture } from '@/lib/analytics';
import {
  type Client,
  type Company,
  type EstimateLine,
  DEFAULT_MARKUP_PERCENT,
  DEFAULT_TAX_PERCENT,
  addDays,
  computeTotals,
  defaultNotes,
  emptyCompany,
  formatMoney,
  isoDate,
  lineAmount,
  linesFromTrade,
  newLineId,
  safeFilenamePart,
} from '@/lib/estimate';
import { resizeImageToDataUrl } from '@/lib/image';
import {
  bumpEstimateSequence,
  peekEstimateSequence,
  storageKeys,
  usePersistentState,
} from '@/lib/storage';
import { NumberInput, SectionHeading, TextField, inputClass } from './ui';

/** Column captions only appear on phones, where there is no header row. */
const mobileLabelClass = 'mb-1 block text-xs font-semibold text-ink-soft md:hidden';

const emptyClient: Client = {
  clientName: '',
  clientAddress: '',
  projectName: '',
  estimateNumber: '',
  date: '',
  validUntil: '',
};

export function EstimateGenerator({ trade }: { trade: Trade }) {
  const [company, setCompany] = usePersistentState<Company>(
    storageKeys.company,
    emptyCompany,
  );
  const [notes, setNotes] = usePersistentState<string>(storageKeys.notes, defaultNotes);

  const [client, setClient] = useState<Client>(emptyClient);
  const [lines, setLines] = useState<EstimateLine[]>(() => linesFromTrade(trade.lineItems));
  const [markupPercent, setMarkupPercent] = useState(DEFAULT_MARKUP_PERCENT);
  const [taxPercent, setTaxPercent] = useState(DEFAULT_TAX_PERCENT);

  const [logoError, setLogoError] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const startedRef = useRef(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Dates and the estimate counter depend on the browser, so they are filled in
  // after mount to keep the server and client markup identical.
  useEffect(() => {
    const today = isoDate(new Date());
    setClient((previous) => ({
      ...previous,
      estimateNumber: previous.estimateNumber || String(peekEstimateSequence()),
      date: previous.date || today,
      validUntil: previous.validUntil || addDays(today, 30),
    }));
  }, []);

  const totals = useMemo(
    () => computeTotals(lines, markupPercent, taxPercent),
    [lines, markupPercent, taxPercent],
  );

  const markEstimateStarted = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    capture('estimate_started', { trade: trade.slug });
  }, [trade.slug]);

  const updateLine = useCallback(
    (id: string, patch: Partial<EstimateLine>) => {
      markEstimateStarted();
      setLines((previous) =>
        previous.map((line) => (line.id === id ? { ...line, ...patch } : line)),
      );
    },
    [markEstimateStarted],
  );

  const addLine = useCallback(() => {
    markEstimateStarted();
    setLines((previous) => [
      ...previous,
      {
        id: newLineId(),
        description: '',
        qty: 1,
        unit: trade.commonUnits[0] ?? 'each',
        rate: 0,
      },
    ]);
  }, [markEstimateStarted, trade.commonUnits]);

  const removeLine = useCallback((id: string) => {
    setLines((previous) => previous.filter((line) => line.id !== id));
  }, []);

  const moveLine = useCallback((from: number, to: number) => {
    setLines((previous) => {
      if (to < 0 || to >= previous.length || from === to) return previous;
      const next = [...previous];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  async function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setLogoError(null);
    try {
      const logoDataUrl = await resizeImageToDataUrl(file);
      setCompany((previous) => ({ ...previous, logoDataUrl }));
    } catch (error) {
      setLogoError(error instanceof Error ? error.message : 'Could not read that image.');
    } finally {
      // Allow re-selecting the same file after an error.
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  }

  async function handleDownload() {
    setPdfError(null);
    setGenerating(true);
    try {
      // Both imports are deferred: @react-pdf/renderer is far too large to sit
      // in the initial bundle of a page that has to score well on mobile.
      const [{ pdf }, { EstimateDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./EstimateDocument'),
      ]);

      const blob = await pdf(
        <EstimateDocument
          company={company}
          client={client}
          lines={lines}
          totals={totals}
          markupPercent={markupPercent}
          taxPercent={taxPercent}
          notes={notes}
        />,
      ).toBlob();

      const filename = `estimate-${safeFilenamePart(client.clientName, 'customer')}-${
        client.date || isoDate(new Date())
      }.pdf`;
      downloadBlob(blob, filename);

      capture('pdf_downloaded', {
        trade: trade.slug,
        lineItemCount: lines.length,
        total: Math.round(totals.total * 100) / 100,
      });

      bumpEstimateSequence(Number.parseInt(client.estimateNumber, 10));
      setClient((previous) => ({
        ...previous,
        estimateNumber: String(peekEstimateSequence()),
      }));
    } catch {
      setPdfError('Something went wrong building the PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  }

  function handleReset() {
    const today = isoDate(new Date());
    setLines(linesFromTrade(trade.lineItems));
    setMarkupPercent(DEFAULT_MARKUP_PERCENT);
    setTaxPercent(DEFAULT_TAX_PERCENT);
    setClient({
      ...emptyClient,
      estimateNumber: String(peekEstimateSequence()),
      date: today,
      validUntil: addDays(today, 30),
    });
    startedRef.current = false;
  }

  const unitOptions = useMemo(() => {
    const fromLines = lines.map((line) => line.unit);
    return Array.from(new Set([...trade.commonUnits, ...fromLines])).filter(Boolean);
  }, [lines, trade.commonUnits]);

  return (
    <section
      id="estimate-generator"
      aria-labelledby="generator-heading"
      className="rounded-xl border border-line bg-surface shadow-sm"
    >
      <div className="border-b border-line bg-surface-soft px-4 py-4 sm:px-6">
        <h2 id="generator-heading" className="text-xl font-bold tracking-tight">
          {trade.name} estimate builder
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Everything below is pre-filled and editable. Your business details are saved in
          this browser so you never retype them.
        </p>
      </div>

      <div className="space-y-8 px-4 py-6 sm:px-6">
        {/* ---------------- Your business ---------------- */}
        <div>
          <SectionHeading description="Saved on this device. Nothing is uploaded.">
            Your business
          </SectionHeading>

          <div className="mb-4 flex flex-wrap items-center gap-4">
            {company.logoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- user-supplied data URL
              <img
                src={company.logoDataUrl}
                alt="Your uploaded company logo"
                className="h-16 w-auto max-w-[10rem] rounded border border-line object-contain"
              />
            ) : (
              <div className="flex h-16 w-40 items-center justify-center rounded border border-dashed border-line text-xs text-ink-soft">
                No logo yet
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex min-h-11 cursor-pointer items-center rounded-md border border-line bg-surface px-4 py-2 text-sm font-semibold hover:bg-surface-soft">
                {company.logoDataUrl ? 'Replace logo' : 'Upload logo'}
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="sr-only"
                  onChange={handleLogoChange}
                />
              </label>
              {company.logoDataUrl ? (
                <button
                  type="button"
                  className="min-h-11 rounded-md border border-line px-4 py-2 text-sm font-semibold hover:bg-surface-soft"
                  onClick={() => setCompany((previous) => ({ ...previous, logoDataUrl: null }))}
                >
                  Remove
                </button>
              ) : null}
            </div>
          </div>
          {logoError ? (
            <p role="alert" className="mb-4 text-sm font-semibold text-red-700">
              {logoError}
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Business name"
              value={company.businessName}
              autoComplete="organization"
              placeholder="Northside Roofing LLC"
              onChange={(businessName) =>
                setCompany((previous) => ({ ...previous, businessName }))
              }
            />
            <TextField
              label="Licence number"
              value={company.licenceNumber}
              placeholder="TX-1234567"
              onChange={(licenceNumber) =>
                setCompany((previous) => ({ ...previous, licenceNumber }))
              }
            />
            <TextField
              label="Phone"
              type="tel"
              autoComplete="tel"
              value={company.phone}
              placeholder="(512) 555-0134"
              onChange={(phone) => setCompany((previous) => ({ ...previous, phone }))}
            />
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              value={company.email}
              placeholder="office@northsideroofing.com"
              onChange={(email) => setCompany((previous) => ({ ...previous, email }))}
            />
            <div className="sm:col-span-2">
              <TextField
                label="Business address"
                multiline
                rows={2}
                value={company.address}
                placeholder="4120 Burnet Rd, Austin, TX 78756"
                onChange={(address) => setCompany((previous) => ({ ...previous, address }))}
              />
            </div>
          </div>
        </div>

        {/* ---------------- Customer ---------------- */}
        <div>
          <SectionHeading>Customer and estimate details</SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Customer name"
              value={client.clientName}
              placeholder="Dana Whitfield"
              onChange={(clientName) => setClient((previous) => ({ ...previous, clientName }))}
            />
            <TextField
              label="Project name"
              value={client.projectName}
              placeholder="Main house re-roof"
              onChange={(projectName) =>
                setClient((previous) => ({ ...previous, projectName }))
              }
            />
            <div className="sm:col-span-2">
              <TextField
                label="Customer address"
                multiline
                rows={2}
                value={client.clientAddress}
                placeholder="18 Sycamore Lane, Austin, TX 78704"
                onChange={(clientAddress) =>
                  setClient((previous) => ({ ...previous, clientAddress }))
                }
              />
            </div>
            <TextField
              label="Estimate number"
              value={client.estimateNumber}
              hint="Counts up automatically after each download."
              onChange={(estimateNumber) =>
                setClient((previous) => ({ ...previous, estimateNumber }))
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Date"
                type="date"
                value={client.date}
                onChange={(date) =>
                  setClient((previous) => ({
                    ...previous,
                    date,
                    validUntil: addDays(date, 30),
                  }))
                }
              />
              <TextField
                label="Valid until"
                type="date"
                value={client.validUntil}
                onChange={(validUntil) => setClient((previous) => ({ ...previous, validUntil }))}
              />
            </div>
          </div>
        </div>

        {/* ---------------- Line items ---------------- */}
        <div>
          <SectionHeading description="Use the arrows to reorder — or drag the handle on a larger screen.">
            Line items
          </SectionHeading>

          <div
            className="hidden gap-3 border-b border-line pb-2 text-xs font-bold tracking-wide text-ink-soft md:grid md:grid-cols-[1.5rem_minmax(0,1fr)_5rem_7rem_7rem_6.5rem_5.5rem]"
            aria-hidden="true"
          >
            <span />
            <span>DESCRIPTION</span>
            <span className="text-right">QTY</span>
            <span>UNIT</span>
            <span className="text-right">RATE</span>
            <span className="text-right">AMOUNT</span>
            <span />
          </div>

          <ul className="divide-y divide-line-soft md:divide-y-0">
            {lines.map((line, index) => (
              <li
                key={line.id}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragEnd={() => setDragIndex(null)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  if (dragIndex !== null) moveLine(dragIndex, index);
                  setDragIndex(null);
                }}
                className={`grid grid-cols-2 gap-3 py-4 md:grid-cols-[1.5rem_minmax(0,1fr)_5rem_7rem_7rem_6.5rem_5.5rem] md:items-center md:py-2 ${
                  dragIndex === index ? 'opacity-50' : ''
                }`}
              >
                <span
                  aria-hidden="true"
                  className="hidden cursor-grab select-none text-center text-ink-soft md:block"
                  title="Drag to reorder"
                >
                  ⠿
                </span>

                <div className="col-span-2 md:col-span-1">
                  <label className="sr-only" htmlFor={`${line.id}-description`}>
                    Description for line {index + 1}
                  </label>
                  <input
                    id={`${line.id}-description`}
                    className={inputClass}
                    value={line.description}
                    placeholder="Description"
                    onChange={(event) =>
                      updateLine(line.id, { description: event.target.value })
                    }
                  />
                </div>

                <div>
                  <span className={mobileLabelClass}>Qty</span>
                  <NumberInput
                    ariaLabel={`Quantity for line ${index + 1}`}
                    value={line.qty}
                    onChange={(qty) => updateLine(line.id, { qty })}
                  />
                </div>

                <div>
                  <label className={mobileLabelClass} htmlFor={`${line.id}-unit`}>
                    Unit
                  </label>
                  <input
                    id={`${line.id}-unit`}
                    aria-label={`Unit for line ${index + 1}`}
                    className={inputClass}
                    list="estimate-units"
                    value={line.unit}
                    placeholder="Unit"
                    onChange={(event) => updateLine(line.id, { unit: event.target.value })}
                  />
                </div>

                <div>
                  <span className={mobileLabelClass}>Rate</span>
                  <NumberInput
                    ariaLabel={`Rate for line ${index + 1}`}
                    value={line.rate}
                    prefix="$"
                    onChange={(rate) => updateLine(line.id, { rate })}
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <span className={mobileLabelClass}>Amount</span>
                  <output
                    aria-label={`Amount for line ${index + 1}`}
                    className="block py-2 text-right font-semibold tabular-nums"
                  >
                    {formatMoney(lineAmount(line))}
                  </output>
                </div>

                {/* One grid cell — a separate desktop delete button would
                    overflow the seven-column template onto a second row. */}
                <div className="col-span-2 flex items-center justify-end gap-1 md:col-span-1 md:gap-0">
                  <button
                    type="button"
                    aria-label={`Move line ${index + 1} up`}
                    disabled={index === 0}
                    onClick={() => moveLine(index, index - 1)}
                    className="min-h-11 w-11 rounded text-ink-soft hover:bg-surface-soft disabled:opacity-30 md:h-8 md:min-h-0 md:w-7"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    aria-label={`Move line ${index + 1} down`}
                    disabled={index === lines.length - 1}
                    onClick={() => moveLine(index, index + 1)}
                    className="min-h-11 w-11 rounded text-ink-soft hover:bg-surface-soft disabled:opacity-30 md:h-8 md:min-h-0 md:w-7"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete line ${index + 1}`}
                    onClick={() => removeLine(line.id)}
                    className="min-h-11 shrink-0 rounded px-3 font-semibold text-red-700 hover:bg-red-50 md:hidden"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete line ${index + 1}`}
                    onClick={() => removeLine(line.id)}
                    className="hidden h-8 w-7 rounded text-lg text-ink-soft hover:bg-red-50 hover:text-red-700 md:block"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <datalist id="estimate-units">
            {unitOptions.map((unit) => (
              <option key={unit} value={unit} />
            ))}
          </datalist>

          <button
            type="button"
            onClick={addLine}
            className="mt-4 min-h-11 w-full rounded-md border border-dashed border-line px-4 py-2 font-semibold text-brand hover:bg-brand-soft sm:w-auto"
          >
            + Add line item
          </button>
        </div>

        {/* ---------------- Totals ---------------- */}
        <div className="rounded-lg border border-line bg-surface-soft p-4 sm:p-5">
          <SectionHeading>Totals</SectionHeading>
          <dl className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <dt className="font-medium">Subtotal</dt>
              <dd className="text-lg font-semibold tabular-nums">
                {formatMoney(totals.subtotal)}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2 font-medium">
                <span>Markup</span>
                <span className="w-24">
                  <NumberInput
                    ariaLabel="Markup percentage"
                    value={markupPercent}
                    suffix="%"
                    onChange={setMarkupPercent}
                  />
                </span>
              </dt>
              <dd className="text-lg font-semibold tabular-nums">
                {formatMoney(totals.markupAmount)}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2 font-medium">
                <span>Tax</span>
                <span className="w-24">
                  <NumberInput
                    ariaLabel="Tax percentage"
                    value={taxPercent}
                    suffix="%"
                    onChange={setTaxPercent}
                  />
                </span>
              </dt>
              <dd className="text-lg font-semibold tabular-nums">
                {formatMoney(totals.taxAmount)}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4 border-t-2 border-ink pt-3">
              <dt className="text-lg font-bold">Total</dt>
              <dd className="text-2xl font-bold tabular-nums">{formatMoney(totals.total)}</dd>
            </div>
          </dl>
        </div>

        {/* ---------------- Notes ---------------- */}
        <div>
          <SectionHeading description="Saved for next time.">Notes and terms</SectionHeading>
          <TextField
            label="Notes and terms"
            multiline
            rows={6}
            value={notes}
            onChange={setNotes}
          />
        </div>

        {/* ---------------- Actions ---------------- */}
        <div className="sticky bottom-0 -mx-4 border-t border-line bg-surface px-4 py-4 sm:-mx-6 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row-reverse sm:items-center sm:justify-start">
            <button
              type="button"
              onClick={handleDownload}
              disabled={generating}
              className="min-h-14 w-full rounded-md bg-brand px-6 text-lg font-bold text-white hover:bg-brand-dark disabled:opacity-60 sm:w-auto"
            >
              {generating ? 'Building PDF…' : 'Download PDF'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="min-h-14 w-full rounded-md border border-line px-6 font-semibold hover:bg-surface-soft sm:w-auto"
            >
              Reset
            </button>
            <p className="text-sm text-ink-soft sm:mr-auto">
              Free, unwatermarked, no signup.
            </p>
          </div>
          {pdfError ? (
            <p role="alert" className="mt-3 text-sm font-semibold text-red-700">
              {pdfError}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Revoking immediately can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
