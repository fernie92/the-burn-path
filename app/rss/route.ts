// app/rss/route.ts
import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.theburnpath.com";

function escapeXml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export const runtime = "nodejs";

export async function GET() {
  const posts = getAllPosts();

  const title = "The Burn Path";
  const description = "Mindset, fitness, and money. Building toward financial freedom.";
  const feedUrl = `${SITE_URL}/rss`;
  const siteUrl = SITE_URL;

  const items = posts
    .filter((p) => p.slug && p.title)
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`;
      const pubDate = p.date ? new Date(p.date).toUTCString() : new Date().toUTCString();
      const itemDescription = p.description ? escapeXml(p.description) : "";

      return `
        <item>
          <title>${escapeXml(p.title)}</title>
          <link>${url}</link>
          <guid>${url}</guid>
          <pubDate>${pubDate}</pubDate>
          <description>${itemDescription}</description>
        </item>
      `.trim();
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${feedUrl}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
