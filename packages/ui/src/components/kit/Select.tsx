import type { ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@workspace/ui/lib/utils";

type SelectOption = { value: string; label: string };

type SelectProps = {
  label: ReactNode;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly SelectOption[];
  placeholder?: string;
  required?: boolean;
  hint?: ReactNode;
} & Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "value" | "onChange" | "name" | "required"
>;

/**
 * Native <select> styled to match <Input>. The caret is a sibling span
 * because `appearance: none` strips the default arrow.
 */
export function Select({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required,
  hint,
  className,
  ...rest
}: SelectProps) {
  return (
    <div className="border-b border-dotted border-hair py-2.5">
      <div className="flex items-baseline gap-3 font-mono text-[13px]">
        <label htmlFor={name} className="w-[220px] shrink-0 text-faint">
          {label}
          {required && <span className="text-ink"> *</span>}:
        </label>
        <div className="relative flex flex-1 items-baseline">
          <select
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className={cn(
              "w-full appearance-none border-0 bg-transparent pr-5 font-mono text-[13px] text-ink outline-none",
              value === "" && "italic text-faint",
              className,
            )}
            {...rest}
          >
            {placeholder !== undefined && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((o) => (
              <option key={o.value} value={o.value} className="not-italic text-ink">
                {o.label}
              </option>
            ))}
          </select>
          <span
            aria-hidden
            className="pointer-events-none absolute right-0 text-faint"
          >
            ▾
          </span>
        </div>
      </div>
      {hint && (
        <div className="mt-0.5 ml-[232px] font-mono text-[11px] text-faint">
          ↳ {hint}
        </div>
      )}
    </div>
  );
}
