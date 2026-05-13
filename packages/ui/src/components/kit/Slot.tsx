import type { CSSProperties, ReactNode } from "react";

type SlotProps = {
  label: ReactNode;
  h?: number;
};

/**
 * Dashed-border image placeholder with diagonal hatching. Used in wireframes
 * where a screenshot / artwork would eventually live. Height is dynamic
 * (passed as a number of pixels) so it's set via inline style.
 */
export function Slot({ label, h = 100 }: SlotProps) {
  const style: CSSProperties = { height: h };

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden border border-dashed border-hair font-mono text-[10px] uppercase tracking-[0.1em] text-faint"
      style={style}
    >
      <div className="absolute inset-0 bg-[length:12px_12px] bg-[linear-gradient(135deg,transparent_49.5%,var(--hair)_49.5%,var(--hair)_50.5%,transparent_50.5%)] opacity-50" />
      <span className="relative bg-paper px-2">{label}</span>
    </div>
  );
}
