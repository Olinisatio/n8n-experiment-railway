'use client';

import { useEffect, useId, useState } from 'react';

export const inputClass =
  'w-full min-h-11 rounded-md border border-line bg-surface px-3 py-2 text-ink placeholder:text-ink-soft/60 focus:border-brand';

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: (id: string) => React.ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children(id)}
      {hint ? <p className="mt-1 text-xs text-ink-soft">{hint}</p> : null}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  autoComplete,
  multiline = false,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
  rows?: number;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      {(id) =>
        multiline ? (
          <textarea
            id={id}
            className={inputClass}
            rows={rows}
            value={value}
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
          />
        ) : (
          <input
            id={id}
            type={type}
            className={inputClass}
            value={value}
            placeholder={placeholder}
            autoComplete={autoComplete}
            onChange={(event) => onChange(event.target.value)}
          />
        )
      }
    </Field>
  );
}

function toDisplay(value: number): string {
  if (!Number.isFinite(value)) return '';
  return String(value);
}

/**
 * Numeric input that keeps its own text draft while focused, so clearing the
 * field to retype does not snap back to "0" under the cursor.
 */
export function NumberInput({
  value,
  onChange,
  ariaLabel,
  className,
  min = 0,
  step = 'any',
  prefix,
  suffix,
}: {
  value: number;
  onChange: (value: number) => void;
  ariaLabel: string;
  className?: string;
  min?: number;
  step?: number | 'any';
  prefix?: string;
  suffix?: string;
}) {
  const [draft, setDraft] = useState(() => toDisplay(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setDraft(toDisplay(value));
  }, [value, focused]);

  const field = (
    <input
      type="number"
      inputMode="decimal"
      min={min}
      step={step}
      aria-label={ariaLabel}
      className={`${inputClass} text-right tabular-nums ${prefix ? 'pl-6' : ''} ${
        suffix ? 'pr-7' : ''
      } ${className ?? ''}`}
      value={draft}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        setDraft(toDisplay(value));
      }}
      onChange={(event) => {
        setDraft(event.target.value);
        const parsed = Number.parseFloat(event.target.value);
        onChange(Number.isFinite(parsed) ? parsed : 0);
      }}
    />
  );

  if (!prefix && !suffix) return field;

  return (
    <div className="relative">
      {prefix ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
        >
          {prefix}
        </span>
      ) : null}
      {field}
      {suffix ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft"
        >
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

export function SectionHeading({
  children,
  description,
}: {
  children: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold tracking-tight text-ink">{children}</h3>
      {description ? <p className="mt-1 text-sm text-ink-soft">{description}</p> : null}
    </div>
  );
}
