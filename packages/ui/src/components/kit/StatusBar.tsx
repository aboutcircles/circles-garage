import type { ReactNode } from "react";
import { Wordmark } from "./Wordmark";

type StatusBarProps = {
  status?: ReactNode;
};

/**
 * Dark strip at the top of every <Page>. Partner Placement lockup on the
 * left (Circles symbol + hair + garage), live metric slot (passed via
 * `status`) on the right.
 */
export function StatusBar({ status }: StatusBarProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-2 bg-ink px-4 py-2 font-mono text-[11px] tracking-[0.04em] text-paper">
      <Wordmark variant="compact" />
      <div className="flex items-center gap-[14px]">{status}</div>
    </header>
  );
}
