import type { LineItem } from '@/data/types';

export type Company = {
  logoDataUrl: string | null;
  businessName: string;
  phone: string;
  email: string;
  address: string;
  licenceNumber: string;
};

export type Client = {
  clientName: string;
  clientAddress: string;
  projectName: string;
  estimateNumber: string;
  date: string;
  validUntil: string;
};

export type EstimateLine = {
  id: string;
  description: string;
  qty: number;
  unit: string;
  rate: number;
};

export type Totals = {
  subtotal: number;
  markupAmount: number;
  taxAmount: number;
  total: number;
};

export const emptyCompany: Company = {
  logoDataUrl: null,
  businessName: '',
  phone: '',
  email: '',
  address: '',
  licenceNumber: '',
};

export const defaultNotes = `Payment terms: 30% deposit due on acceptance, balance due on completion.
This estimate is valid for 30 days from the date above.
Prices assume work can be carried out in a single mobilisation during normal working hours.
Excludes permit fees unless listed above, and any work required by conditions not visible at the time of estimating. Additional work will be quoted as a written change order before it starts.`;

export const DEFAULT_MARKUP_PERCENT = 20;
export const DEFAULT_TAX_PERCENT = 0;

let idCounter = 0;

export function newLineId(): string {
  idCounter += 1;
  return `line-${Date.now().toString(36)}-${idCounter}`;
}

export function linesFromTrade(items: LineItem[]): EstimateLine[] {
  return items.map((item) => ({
    id: newLineId(),
    description: item.description,
    qty: item.defaultQty,
    unit: item.unit,
    rate: item.defaultRate,
  }));
}

export function lineAmount(line: EstimateLine): number {
  const amount = line.qty * line.rate;
  return Number.isFinite(amount) ? amount : 0;
}

export function computeTotals(
  lines: EstimateLine[],
  markupPercent: number,
  taxPercent: number,
): Totals {
  const subtotal = lines.reduce((sum, line) => sum + lineAmount(line), 0);
  const markupAmount = subtotal * (safePercent(markupPercent) / 100);
  // Tax applies to the marked-up figure — that is the price the customer pays.
  const taxAmount = (subtotal + markupAmount) * (safePercent(taxPercent) / 100);
  return {
    subtotal,
    markupAmount,
    taxAmount,
    total: subtotal + markupAmount + taxAmount,
  };
}

function safePercent(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMoney(value: number): string {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

/** ISO yyyy-mm-dd for <input type="date">, in the user's local timezone. */
export function isoDate(date: Date): string {
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  const parsed = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return iso;
  parsed.setDate(parsed.getDate() + days);
  return isoDate(parsed);
}

/** Human-readable date for the PDF, e.g. "12 March 2026". */
export function formatDate(iso: string): string {
  const parsed = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Strips characters that break filenames across Windows, macOS and Linux. */
export function safeFilenamePart(value: string, fallback: string): string {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return cleaned || fallback;
}
