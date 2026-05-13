import type { ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";

type KbdProps = {
  children: ReactNode;
  className?: string;
};

export function Kbd({ children, className }: KbdProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-[2px] border border-current px-[5px] font-mono text-[10px] leading-[1.4]",
        className,
      )}
    >
      {children}
    </span>
  );
}
