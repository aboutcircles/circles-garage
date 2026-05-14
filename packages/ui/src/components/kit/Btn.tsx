import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";

type BtnProps = {
  children: ReactNode;
  primary?: boolean;
  ghost?: boolean;
  sm?: boolean;
  href?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

/**
 * Three variants:
 * - default: outlined (`border border-ink`)
 * - `primary`: filled (`bg-ink text-paper`)
 * - `ghost`: underlined text only
 *
 * `sm` shrinks padding & type. Renders a `<button>` by default; when `href`
 * is set, renders an `<a>` so the same styling works for navigation CTAs.
 */
export function Btn({
  children,
  primary,
  ghost,
  sm,
  className,
  href,
  type = "button",
  ...rest
}: BtnProps) {
  const classes = ghost
    ? cn(
        "cursor-pointer font-mono text-xs text-ink underline underline-offset-[3px]",
        className,
      )
    : cn(
        "inline-flex cursor-pointer items-center gap-1.5 border border-ink font-mono font-bold uppercase tracking-[0.04em]",
        primary ? "bg-ink text-paper" : "bg-transparent text-ink",
        sm ? "px-2.5 py-[5px] text-[11px]" : "px-3.5 py-2 text-xs",
        className,
      );

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
