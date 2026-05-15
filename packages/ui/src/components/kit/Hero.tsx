import type { ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";

type HeroSize = "xl" | "lg" | "md";

type HeroProps = {
  kicker?: ReactNode;
  sub?: ReactNode;
  ctas?: ReactNode;
  size?: HeroSize;
  children?: ReactNode;
};

const SIZE_CLASSES: Record<HeroSize, string> = {
  // Closest Tailwind text scales to the kit's 52 / 40 / 32px headlines.
  xl: "text-5xl", // 48px (target 52)
  lg: "text-4xl", // 36px (target 40)
  md: "text-3xl", // 30px (target 32)
};

/**
 * Big monospace headline used at the top of landing / dashboard panes.
 * `kicker` is the small faint preline, `sub` is the secondary paragraph,
 * `ctas` is a row of buttons. `children` is the headline itself.
 */
export function Hero({
  kicker,
  sub,
  ctas,
  size = "lg",
  children,
}: HeroProps) {
  return (
    <div>
      {kicker && (
        <div className="mb-2 font-mono text-[11px] tracking-[0.15em] text-faint">
          {kicker}
        </div>
      )}
      <h1
        className={cn(
          "font-mono font-bold leading-[1.02] tracking-[-1.3px] text-balance",
          SIZE_CLASSES[size],
        )}
      >
        {children}
      </h1>
      {sub && (
        <p className="mt-3.5 max-w-[640px] font-mono text-sm leading-[1.55] text-faint">
          {sub}
        </p>
      )}
      {ctas && <div className="mt-[18px] flex items-center gap-3">{ctas}</div>}
    </div>
  );
}
