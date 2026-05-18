import { NextResponse } from "next/server";

// Static manifest. The accountAssociation signature is bound to the
// `garage.aboutcircles.com` domain — re-sign in the Farcaster manifest tool
// if the production domain changes.
const manifest = {
  accountAssociation: {
    header:
      "eyJmaWQiOjEzNTk2LCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4ODE3MzE4RDZmRkY2NkExOGQ4M0ExMzc2QTc2RjZlMzBCNDNjODg4OSJ9",
    payload: "eyJkb21haW4iOiJnYXJhZ2UuYWJvdXRjaXJjbGVzLmNvbSJ9",
    signature:
      "BHEn+PDucnOZUaQjSCAUIA1D2X43pep1EbJw4L60SjcpVG59BbFHaWxmt1yxgK/KE+/dseMN1zH+a5Xxsq9I+Bw=",
  },
  frame: {
    version: "1",
    name: "circles/garage",
    iconUrl: "https://garage.aboutcircles.com/icon.png",
    homeUrl: "https://garage.aboutcircles.com",
    imageUrl: "https://garage.aboutcircles.com/image.png",
    buttonTitle: "open garage",
    splashImageUrl: "https://garage.aboutcircles.com/splash.png",
    splashBackgroundColor: "#14110d",
  },
} as const;

export function GET() {
  return NextResponse.json(manifest, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
