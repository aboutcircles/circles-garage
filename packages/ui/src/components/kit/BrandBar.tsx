import { ThemeToggle } from "./ThemeToggle";
import { Wordmark } from "./Wordmark";

const LINKS: ReadonlyArray<{ label: string; href: string }> = [
  { label: "aboutcircles.com", href: "https://aboutcircles.com" },
  { label: "docs.aboutcircles.com/miniapps", href: "https://docs.aboutcircles.com/miniapps" },
  { label: "t.me/about_circles", href: "https://t.me/about_circles/499" },
];

const MOBILE_LINKS: ReadonlyArray<{ label: string; href: string }> = [
  { label: "docs", href: "https://docs.aboutcircles.com/miniapps" },
  { label: "telegram", href: "https://t.me/about_circles/499" },
];

/**
 * Bottom strip on every <Page>. Partner Placement full lockup on the left,
 * Circles tagline + outbound links on the right.
 */
export function BrandBar() {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-hair bg-paper px-3 py-2 font-mono text-[11px] text-faint sm:flex-wrap sm:gap-4 sm:px-4">
      <Wordmark variant="full" />
      <div className="hidden flex-wrap items-center gap-4 sm:flex">
        <ThemeToggle />
        <span>circles is money issued by people.</span>
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer noopener"
            className="hover:text-ink"
          >
            {`\u2192 ${link.label}`}
          </a>
        ))}
      </div>
      <div className="flex shrink-0 items-center gap-3 sm:hidden">
        {MOBILE_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer noopener"
            className="hover:text-ink"
          >
            {`\u2192 ${link.label}`}
          </a>
        ))}
      </div>
    </div>
  );
}
