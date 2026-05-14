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
  type?: "text" | "email" | "url";
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "name" | "type" | "required" | "placeholder"
>;

/**
 * Editable counterpart to <Field>. Same dotted-row vocabulary; 220px label
 * column (faint), input on the right. Italic placeholder when empty.
 */
export function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  hint,
  type = "text",
  className,
  ...rest
}: InputProps) {
  return (
    <div className="border-b border-dotted border-hair py-2.5">
      <div className="flex items-baseline gap-3 font-mono text-[13px]">
        <label htmlFor={name} className="w-[220px] shrink-0 text-faint">
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
          className={cn(
            "flex-1 border-0 bg-transparent font-mono text-[13px] text-ink outline-none placeholder:italic placeholder:text-faint",
            className,
          )}
          {...rest}
        />
      </div>
      {hint && (
        <div className="mt-0.5 ml-[232px] font-mono text-[11px] text-faint">
          ↳ {hint}
        </div>
      )}
    </div>
  );
}
