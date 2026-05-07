import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistDisplay = localFont({
  src: "./fonts/geist-latin.woff2",
  variable: "--font-display",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const geistBody = localFont({
  src: "./fonts/geist-latin.woff2",
  variable: "--font-body",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const geistMono = localFont({
  src: "./fonts/geist-mono-latin.woff2",
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});

export const metadata: Metadata = {
  title: "AquaSmart | Field Atlas for Water",
  description:
    "AquaSmart turns irrigation into a living field atlas with sensor-driven watering, predictive control, and cinematic clarity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistDisplay.variable} ${geistBody.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
