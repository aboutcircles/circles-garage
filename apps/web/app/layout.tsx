import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { MiniappReady } from "@/components/miniapp-ready";

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

const SITE = "https://garage.aboutcircles.com";
const fcMiniapp = {
  version: "1",
  imageUrl: `${SITE}/image.png`,
  button: {
    title: "open garage",
    action: {
      type: "launch_frame",
      name: "circles/garage",
      url: SITE,
      splashImageUrl: `${SITE}/splash.png`,
      splashBackgroundColor: "#14110d",
    },
  },
} as const;

export const metadata: Metadata = {
  title: "circles/garage — builder program",
  description:
    "circles/garage — builder program. Ship mini-apps on Circles. Get paid every Monday.",
  icons: { icon: "/favicon.svg" },
  other: {
    "fc:miniapp": JSON.stringify(fcMiniapp),
    // legacy alias still parsed by some clients
    "fc:frame": JSON.stringify(fcMiniapp),
  },
};

// Runs before the body paints so a stored light/dark override is on <html>
// when the CSS resolves. No-op when the user is on "system".
const themeBootstrap = `(() => {
  try {
    var t = localStorage.getItem("theme");
    if (t === "dark" || t === "light") {
      document.documentElement.setAttribute("data-theme", t);
    }
  } catch (e) {}
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={fontMono.variable}>
      <body className="bg-paper font-mono text-ink antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <MiniappReady />
        {children}
      </body>
    </html>
  );
}
