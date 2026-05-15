import type { ReactNode } from "react";

type CmdBarProps = {
  breadcrumb?: ReactNode;
  cmd?: ReactNode;
};

/**
 * Light strip at the bottom of every <Page>. Breadcrumb / command hint on the
 * left.
 */
export function CmdBar({ breadcrumb, cmd }: CmdBarProps) {
  return (
    <footer className="flex items-center justify-between gap-3 border-t border-hair px-4 py-2 font-mono text-[11px] text-faint">
      <span>
        {breadcrumb ?? (
          <>
            <span className="text-ink">:</span>{" "}
            <span className="opacity-60">{cmd ?? ""}</span>
          </>
        )}
      </span>
    </footer>
  );
}
