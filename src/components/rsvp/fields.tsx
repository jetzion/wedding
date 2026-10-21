import type { InputHTMLAttributes, ReactNode } from "react";

export const cardClass = "rounded-3xl border border-sand-edge bg-shell p-6 shadow-sm sm:p-8";
export const primaryButton =
  "rounded-full bg-sea px-8 py-3 text-shell transition-colors hover:bg-sea-dark disabled:opacity-50";
export const secondaryButton =
  "rounded-full border border-sea px-8 py-3 text-sea transition-colors hover:bg-shallows";

const inputClass =
  "w-full rounded-2xl border border-sand-edge bg-sand/40 px-4 py-3 placeholder:text-ink-muted/70 focus:border-sea";

/** Labeled text input. */
export function TextField({
  label,
  hint,
  ...props
}: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm uppercase tracking-[0.15em] text-ink-muted">{label}</span>
      <input className={inputClass} {...props} />
      {hint && <span className="block text-sm text-ink-muted">{hint}</span>}
    </label>
  );
}

/** Labeled multi-line text input. */
export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength: number;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm uppercase tracking-[0.15em] text-ink-muted">{label}</span>
      <textarea
        rows={3}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </label>
  );
}

/** Pill-style radio group. The selected option is filled and shows a dot, not just a color change. */
export function ChoiceGroup<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
  children,
}: {
  legend: string;
  name: string;
  value: T | undefined;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  children?: ReactNode;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="font-serif text-xl">{legend}</legend>
      {children}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.value} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span className="flex items-center gap-2 rounded-full border border-sand-edge px-5 py-2.5 transition-colors peer-checked:border-sea peer-checked:bg-sea peer-checked:text-shell peer-checked:*:bg-current peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sea">
              <span aria-hidden className="size-2.5 rounded-full border border-current" />
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
