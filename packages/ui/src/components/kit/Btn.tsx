import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";

type BtnProps = {
  children: ReactNode;
  primary?: boolean;
  ghost?: boolean;
  sm?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

/**
 * Three variants:
 * - default: outlined (`border border-ink`)
 * - `primary`: filled (`bg-ink text-paper`)
 * - `ghost`: underlined text only
 *
 * `sm` shrinks padding & type. Render is always a `<button>` so screens can
 * attach `onClick` / `type` / etc. later without rewrapping.
 */
export function Btn({
  children,
  primary,
  ghost,
  sm,
  className,
  type = "button",
  ...rest
}: BtnProps) {
  if (ghost) {
    return (
      <button
        type={type}
        className={cn(
          "cursor-pointer font-mono text-xs text-ink underline underline-offset-[3px]",
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 border border-ink font-mono font-bold uppercase tracking-[0.04em]",
        primary ? "bg-ink text-paper" : "bg-transparent text-ink",
        sm ? "px-2.5 py-[5px] text-[11px]" : "px-3.5 py-2 text-xs",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
