import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";

type InputProps = {
  label: ReactNode;
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  hint?: ReactNode;
  invalid?: boolean;
  type?: "text" | "email" | "url";
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "name" | "type" | "required" | "placeholder"
>;

/**
 * Editable counterpart to <Field>. Same dotted-row vocabulary; 220px label
 * column (faint), input on the right. Italic placeholder when empty. Set
 * `invalid` to swap the dotted hair underline for a solid ember one when
 * the row's value fails validation.
 */
export function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  hint,
  invalid,
  type = "text",
  className,
  ...rest
}: InputProps) {
  return (
    <div
      className={cn(
        "py-2.5",
        invalid ? "border-b border-ember" : "border-b border-dotted border-hair",
      )}
    >
      <div className="flex flex-col font-mono text-[13px] sm:flex-row sm:items-baseline sm:gap-3">
        <label htmlFor={name} className="text-faint sm:w-[220px] sm:shrink-0">
          {label}
          {required && <span className="text-ink"> *</span>}:
        </label>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "________"}
          required={required}
          aria-invalid={invalid || undefined}
          className={cn(
            "min-w-0 border-0 bg-transparent font-mono text-[13px] text-ink outline-none placeholder:italic placeholder:text-faint sm:flex-1",
            className,
          )}
          {...rest}
        />
      </div>
      {hint && (
        <div className="mt-0.5 font-mono text-[11px] text-faint sm:ml-[232px]">
          ↳ {hint}
        </div>
      )}
    </div>
  );
}
