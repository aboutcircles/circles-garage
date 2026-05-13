import type { ReactNode } from "react";

type StatusBarProps = {
  status?: ReactNode;
};

/**
 * Dark strip at the top of every <Page>. Wordmark on the left, live metric
 * slot (passed via `status`) on the right.
 */
export function StatusBar({ status }: StatusBarProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-2 bg-ink px-4 py-2 font-mono text-[11px] tracking-[0.04em] text-paper">
      <div className="flex gap-[18px]">
        <span className="font-bold">circles/garage</span>
        <span className="opacity-[0.55]">builder.circles.garage</span>
      </div>
      <div className="flex items-center gap-[14px]">{status}</div>
    </header>
  );
}
