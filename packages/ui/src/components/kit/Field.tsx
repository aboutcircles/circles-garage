import type { ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";

type FieldProps = {
  label: ReactNode;
  value?: ReactNode;
  placeholder?: string;
  required?: boolean;
  hint?: ReactNode;
};

/**
 * Dotted-bottom-border row — the basic form vocabulary. 220px label column
 * (faint), value/placeholder column on the right (italic when empty).
 */
export function Field({
  label,
  value,
  placeholder,
  required,
  hint,
}: FieldProps) {
  const hasValue = value !== undefined && value !== null && value !== "";

  return (
    <div className="border-b border-dotted border-hair py-2.5">
      <div className="flex flex-col font-mono text-[13px] sm:flex-row sm:items-baseline sm:gap-3">
        <span className="text-faint sm:w-[220px] sm:shrink-0">
          {label}
          {required && <span className="text-ink"> *</span>}:
        </span>
        <span
          className={cn(
            "min-w-0 break-words sm:flex-1",
            hasValue ? "not-italic text-ink" : "italic text-faint",
          )}
        >
          {hasValue ? value : (placeholder ?? "________")}
        </span>
      </div>
      {hint && (
        <div className="mt-0.5 font-mono text-[11px] text-faint sm:ml-[232px]">
          ↳ {hint}
        </div>
      )}
    </div>
  );
}
