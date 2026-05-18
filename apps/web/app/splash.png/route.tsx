import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";

// Farcaster spec: 200x200 splash (square, displayed briefly while the app boots).
const SIZE = 200;
const BG = "#14110d"; // matches splashBackgroundColor in farcaster.json
const INK = "#ede9df";
const EMBER = "#ff6a3d";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: SIZE,
          height: SIZE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BG,
        }}
      >
        <svg
          width={92}
          height={(92 * 120) / 89}
          viewBox="0 0 89 120"
          fill="none"
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
      </div>
    ),
    {
      width: SIZE,
      height: SIZE,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400, immutable",
      },
    },
  );
}
