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
    <footer className="flex items-center justify-between gap-3 border-t border-hair px-3 py-1.5 font-mono text-[10px] text-faint sm:px-4 sm:py-2 sm:text-[11px]">
      <span className="truncate">
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
