import type { ReactNode } from "react";
import { Kbd } from "./Kbd";

type CmdBarProps = {
  breadcrumb?: ReactNode;
  cmd?: ReactNode;
};

/**
 * Light strip at the bottom of every <Page>. Breadcrumb / command hint on the
 * left, fixed keyboard shortcut chips on the right.
 */
export function CmdBar({ breadcrumb, cmd }: CmdBarProps) {
  return (
    <footer className="flex items-center justify-between gap-3 border-t border-hair px-4 py-2 font-mono text-[11px] text-faint">
      <span>
        {breadcrumb ?? (
          <>
            <span className="text-ink">:</span>{" "}
            <span className="opacity-60">{cmd ?? "press ? for help"}</span>
          </>
        )}
      </span>
      <span className="flex gap-4">
        <span>
          <Kbd>?</Kbd> help
        </span>
        <span>
          <Kbd>g</Kbd> goto
        </span>
        <span>
          <Kbd>n</Kbd> new app
        </span>
        <span>
          <Kbd>q</Kbd> sign out
        </span>
      </span>
    </footer>
  );
}
