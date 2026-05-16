type WordmarkProps = { variant: "compact" | "full" };

/**
 * Partner Placement lockup: Circles mark, 1px hair separator, "garage" in
 * mono. The SVG carries the "Circles" name — never retyped in JSX.
 *
 * - `compact`: symbol only. Sized for the StatusBar rail.
 * - `full`: symbol + "Circles" wordmark. Sized for the BrandBar.
 *
 * Always renders as a link to `/home` — the app provides a small redirect
 * handler at that path that points logged-in users at /dashboard and
 * everyone else at the landing page.
 */
export function Wordmark({ variant }: WordmarkProps) {
  if (variant === "compact") {
    return (
      <a href="/home" className="inline-flex items-center hover:opacity-80">
        <img
          src="/brand/circles-symbol.svg"
          alt="Circles"
          className="h-[14px] w-auto"
        />
        <span className="mx-2 h-[14px] border-l border-current/30" />
        <span className="font-bold">garage</span>
      </a>
    );
  }

  return (
    <a href="/home" className="inline-flex items-center hover:opacity-80">
      <img
        src="/brand/circles-logo.svg"
        alt="Circles"
        className="wordmark-light h-[22px] w-auto"
      />
      <img
        src="/brand/circles-logo-dark.svg"
        alt=""
        aria-hidden
        className="wordmark-dark h-[22px] w-auto"
      />
      <span className="mx-2 h-[22px] border-l border-hair" />
      <span className="font-mono text-[13px] font-bold">garage</span>
    </a>
  );
}
