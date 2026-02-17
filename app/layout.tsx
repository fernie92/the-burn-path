// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.theburnpath.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "The Burn Path",
    template: "%s | The Burn Path",
  },
  description: "Mindset, fitness, and money. Building toward financial freedom.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "The Burn Path",
    description:
      "Mindset, fitness, and money. Building toward financial freedom.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header style={{ borderBottom: "1px solid #eee", padding: "16px 0" }}>
          <nav style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
            <Link href="/" style={{ marginRight: 16 }}>
              Home
            </Link>
            <Link href="/blog" style={{ marginRight: 16 }}>
              Blog
            </Link>
            <Link href="/about">About</Link>
          </nav>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
