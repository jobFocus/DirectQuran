import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quran Mosque Experience",
  description:
    "Experience the Holy Quran with serene visuals of iconic mosques from around the world.",
  openGraph: {
    title: "Quran Mosque Experience",
    description:
      "Experience the Holy Quran with serene visuals of iconic mosques from around the world.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
