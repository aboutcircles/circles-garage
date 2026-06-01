import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";

const W = 1200;
const H = 800; // 3:2 — Farcaster embed spec

const INK = "#ede9df";
const PAPER = "#14110d";
const FAINT = "rgba(237, 233, 223, 0.55)";
const HAIR = "rgba(237, 233, 223, 0.18)";
const EMBER = "#ff6a3d";

async function loadFont(weight: 400 | 700): Promise<ArrayBuffer | null> {
  try {
    const text = encodeURIComponent(
      // glyphs we actually render — keeps Google's subset small
      "circlesgarage/·.→|0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz $-",
    );
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@${weight}&text=${text}`,
      { headers: { "User-Agent": "Mozilla/5.0 (compatible)" } },
    ).then((r) => r.text());
    const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
    if (!match) return null;
    const res = await fetch(match[1]!);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

function CirclesSymbol({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={(size * 120) / 89}
      viewBox="0 0 89 120"
      fill="none"
      style={{ display: "block" }}
    >
      <path
        d="M60.07 90.8214V114.701C60.07 117.761 57.6 120.261 54.56 119.981C48.56 119.431 42.67 117.971 37.08 115.651C29.79 112.621 23.17 108.191 17.59 102.591C12.01 97.0014 7.59 90.3614 4.57 83.0514C1.55 75.7414 0 67.9114 0 60.0014C0 52.0914 1.55 44.2614 4.57 36.9514C7.59 29.6414 12.01 23.0014 17.59 17.4114C23.17 11.8214 29.79 7.38144 37.08 4.35144C42.67 2.03144 48.57 0.581444 54.57 0.0214435C57.6 -0.258556 60.08 2.24144 60.08 5.30144V31.1914C44.21 31.1914 31.34 44.0914 31.34 60.0114C31.34 75.9314 44.2 88.8214 60.07 88.8314"
        fill={INK}
      />
      <path
        d="M60.0004 89.0532L59.9998 31.0769C76.0095 31.0769 88.9879 44.0553 88.9879 60.0651C88.9879 76.0746 76.0098 89.0529 60.0004 89.0532Z"
        fill={EMBER}
      />
    </svg>
  );
}

type FontOpts = NonNullable<
  ConstructorParameters<typeof ImageResponse>[1]
>["fonts"];

export async function GET() {
  const [regular, bold] = await Promise.all([loadFont(400), loadFont(700)]);
  const fonts: FontOpts = [];
  if (regular)
    fonts.push({ name: "JetBrains Mono", data: regular, weight: 400 });
  if (bold) fonts.push({ name: "JetBrains Mono", data: bold, weight: 700 });

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          display: "flex",
          flexDirection: "column",
          background: PAPER,
          color: INK,
          fontFamily: "'JetBrains Mono', monospace",
          padding: "72px 80px",
          justifyContent: "space-between",
        }}
      >
        {/* top: kicker */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              color: EMBER,
              letterSpacing: 0.4,
            }}
          >
            // circles/garage · 6-week builder program · paid monday in CRC
          </div>
          <div
            style={{
              display: "flex",
              borderTop: `1px dashed ${HAIR}`,
              width: "100%",
            }}
          />
        </div>

        {/* hero: headline + sub */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            marginTop: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
            Ship mini-apps
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
            on&nbsp;
            <span style={{ color: EMBER }}>Circles.</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: FAINT,
              lineHeight: 1.4,
              marginTop: 8,
              maxWidth: 980,
            }}
          >
            Top 3 builders share $500 in CRC every week. 6 cycles,
            monday-to-sunday. Ship a mini-app · get paid every monday.
          </div>
        </div>

        {/* bottom: brand + url */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              borderTop: `1px dashed ${HAIR}`,
              width: "100%",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <CirclesSymbol size={42} />
              <div
                style={{
                  display: "flex",
                  width: 1,
                  height: 32,
                  background: HAIR,
                }}
              />
              <div
                style={{
                  display: "flex",
                  fontSize: 28,
                  fontWeight: 700,
                }}
              >
                Circles / garage
              </div>
            </div>
            <div style={{ display: "flex", fontSize: 20, color: FAINT }}>
              → garage.aboutcircles.com
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      fonts,
      headers: {
        // OG image is shared/cached by Farcaster's image proxy; long cache is fine.
        "Cache-Control": "public, max-age=3600, s-maxage=86400, immutable",
      },
    },
  );
}
