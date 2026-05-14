type WordmarkProps = { variant: "compact" | "full" };

/**
 * Partner Placement lockup: Circles mark, 1px hair separator, "garage" in
 * mono. The SVG carries the "Circles" name — never retyped in JSX.
 *
 * - `compact`: symbol only. Sized for the StatusBar rail.
 * - `full`: symbol + "Circles" wordmark. Sized for the BrandBar.
 */
export function Wordmark({ variant }: WordmarkProps) {
  if (variant === "compact") {
    return (
      <span className="inline-flex items-center">
        <img
          src="/brand/circles-symbol.svg"
          alt="Circles"
          className="h-[14px] w-auto"
        />
        <span className="mx-2 h-[14px] border-l border-current/30" />
        <span className="font-bold">garage</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center">
      <img
        src="/brand/circles-logo.svg"
        alt="Circles"
        className="h-[22px] w-auto"
      />
      <span className="mx-2 h-[22px] border-l border-hair" />
      <span className="font-mono text-[13px] font-bold">garage</span>
    </span>
  );
}
