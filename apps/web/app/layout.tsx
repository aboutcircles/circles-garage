import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";

import "@workspace/ui/globals.css";

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "circles/garage — builder program",
  description:
    "circles/garage — builder program. Ship mini-apps on Circles. Get paid every Monday.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={fontMono.variable}>
      <body className="bg-paper font-mono text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
