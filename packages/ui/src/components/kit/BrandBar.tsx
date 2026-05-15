import { Wordmark } from "./Wordmark";

const LINKS: ReadonlyArray<{ label: string; href: string }> = [
  { label: "aboutcircles.com", href: "https://aboutcircles.com" },
  { label: "docs.aboutcircles.com/miniapps", href: "https://docs.aboutcircles.com/miniapps" },
  { label: "t.me/about_circles", href: "https://t.me/about_circles/499" },
];

/**
 * Bottom strip on every <Page>. Partner Placement full lockup on the left,
 * Circles tagline + outbound links on the right.
 */
export function BrandBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-hair bg-paper px-4 py-2 font-mono text-[11px] text-faint">
      <Wordmark variant="full" />
      <div className="flex flex-wrap items-center gap-4">
        <span>circles is money, reimagined.</span>
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
    </div>
  );
}
