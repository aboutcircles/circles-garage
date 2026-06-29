import { content } from "@/lib/content";
import { Btn, Grid, Hero, Page, Pane } from "@workspace/ui/kit";

/**
 * Full-screen "submissions closed" state, rendered by /register and /signup
 * when `SUBMISSIONS_OPEN` (lib/cycle.ts) is false. Copy lives in
 * `content.closed`. `screen` and `breadcrumb` keep the page chrome
 * consistent with the form it replaces.
 */
export function EventClosed({
  screen,
  breadcrumb,
}: {
  screen: string;
  breadcrumb: string;
}) {
  const c = content.closed;
  return (
    <Page screen={screen} scroll breadcrumb={breadcrumb}>
      <Grid cols={1} gap={12} fill>
        <Pane title="submissions closed" hint="circles/garage">
          <div className="mx-auto max-w-[640px] py-12">
            <Hero
              size="lg"
              kicker="// the 6-week program has ended"
              sub={c.body}
              ctas={
                <Btn primary href={c.ctaHref}>
                  {c.cta}
                </Btn>
              }
            >
              {c.head}
            </Hero>
          </div>
        </Pane>
      </Grid>
    </Page>
  );
}
