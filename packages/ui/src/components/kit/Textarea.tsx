import type { ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@workspace/ui/lib/utils";

type TextareaProps = {
  label: ReactNode;
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  hint?: ReactNode;
  rows?: number;
} & Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "onChange" | "name" | "rows" | "required" | "placeholder"
>;

/**
 * Multi-line counterpart to <Input>. Label sits at the top of the row
 * (items-start) so it aligns with the first line of the textarea.
 */
export function Textarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  hint,
  rows = 3,
  className,
  ...rest
}: TextareaProps) {
  return (
    <div className="border-b border-dotted border-hair py-2.5">
      <div className="flex flex-col font-mono text-[13px] sm:flex-row sm:items-start sm:gap-3">
        <label
          htmlFor={name}
          className="text-faint sm:w-[220px] sm:shrink-0 sm:pt-0.5"
        >
          {label}
          {required && <span className="text-ink"> *</span>}:
        </label>
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "________"}
          required={required}
          rows={rows}
          className={cn(
            "min-w-0 resize-none border-0 bg-transparent font-mono text-[13px] leading-[1.55] text-ink outline-none placeholder:italic placeholder:text-faint sm:flex-1",
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
