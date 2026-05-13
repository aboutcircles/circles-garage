import type { CSSProperties, ReactNode } from "react";

export type StatStripItem = {
  k: ReactNode;
  v: ReactNode;
  d?: ReactNode;
};

type StatStripProps = {
  items: StatStripItem[];
};

/**
 * Horizontal grid of metric tiles. Cell count is dynamic so the grid template
 * is set via inline style.
 */
export function StatStrip({ items }: StatStripProps) {
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `repeat(${items.length}, 1fr)`,
  };

  return (
    <dl className="grid border border-hair" style={gridStyle}>
      {items.map((it, i) => {
        const isLast = i === items.length - 1;
        return (
          <div
            key={i}
            className={isLast ? "px-3.5 py-3" : "border-r border-hair px-3.5 py-3"}
          >
            <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
              {it.k}
            </dt>
            <dd className="mt-1.5 font-mono text-[28px] font-bold tracking-[-0.7px]">
              {it.v}
            </dd>
            {it.d && (
              <div className="mt-1 font-mono text-[10px] text-faint">{it.d}</div>
            )}
          </div>
        );
      })}
    </dl>
  );
}
