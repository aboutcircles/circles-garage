import type { ReactNode } from "react";

type SectionProps = {
  num: ReactNode;
  label: ReactNode;
  hint?: ReactNode;
  children?: ReactNode;
};

/**
 * `§ {num} — {label} ─────── {hint}` divider used inside a <Pane> to break
 * a form or document into numbered subsections.
 */
export function Section({ num, label, hint, children }: SectionProps) {
  return (
    <div className="mt-7">
      <div className="mb-3.5 flex items-baseline gap-3">
        <span className="font-mono text-[11px] text-faint">§ {num}</span>
        <span className="font-mono text-base font-bold tracking-[-0.2px]">
          — {label}
        </span>
        <span className="flex-1 border-t border-hair" />
        {hint && <span className="font-mono text-[11px] text-faint">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
