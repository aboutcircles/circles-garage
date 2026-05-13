import type { ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { StatusBar } from "./StatusBar";
import { CmdBar } from "./CmdBar";

type PageProps = {
  children: ReactNode;
  screen?: string;
  status?: ReactNode;
  breadcrumb?: ReactNode;
  cmd?: ReactNode;
  scroll?: boolean;
};

/**
 * Outer chrome for every screen. Renders the dark <StatusBar>, a padded body
 * slot, and the light <CmdBar>. `scroll` toggles whether the body region
 * overflows vertically.
 */
export function Page({
  children,
  screen,
  status,
  breadcrumb,
  cmd,
  scroll,
}: PageProps) {
  return (
    <div
      data-screen-label={screen}
      className="relative flex h-dvh w-full flex-col overflow-hidden bg-paper font-mono text-[13px] text-ink"
    >
      <StatusBar status={status} />
      <main
        className={cn("flex-1 p-4", scroll ? "overflow-auto" : "overflow-hidden")}
      >
        {children}
      </main>
      <CmdBar breadcrumb={breadcrumb} cmd={cmd} />
    </div>
  );
}
