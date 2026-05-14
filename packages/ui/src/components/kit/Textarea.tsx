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
      <div className="flex items-start gap-3 font-mono text-[13px]">
        <label
          htmlFor={name}
          className="w-[220px] shrink-0 pt-0.5 text-faint"
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
            "flex-1 resize-none border-0 bg-transparent font-mono text-[13px] leading-[1.55] text-ink outline-none placeholder:italic placeholder:text-faint",
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
