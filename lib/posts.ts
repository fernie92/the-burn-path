// lib/posts.ts
import fs from "fs";
import path from "path";

export type Post = {
  slug: string;
  title: string;
  date?: string; // ISO string expected, e.g. "2026-02-01"
  description?: string;
  content: string; // markdown body (front matter removed)
};

const postsDir = path.join(process.cwd(), "content", "posts");

function stripQuotes(s: string) {
  return s.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
}

function parseFrontMatter(raw: string): { data: Record<string, string>; body: string } {
  // Supports:
  // ---
  // key: "value"
  // ---
  // body...
  if (!raw.startsWith("---")) return { data: {}, body: raw };

  const lines = raw.split("\n");
  // find second --- delimiter
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      end = i;
      break;
    }
  }
  if (end === -1) return { data: {}, body: raw };

  const fmLines = lines.slice(1, end);
  const bodyLines = lines.slice(end + 1);

  const data: Record<string, string> = {};
  for (const line of fmLines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf(":");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = stripQuotes(trimmed.slice(idx + 1).trim());
    if (key) data[key] = value;
  }

  // remove leading blank lines from body
  while (bodyLines.length && bodyLines[0].trim() === "") bodyLines.shift();

  return { data, body: bodyLines.join("\n") };
}

function inferTitleFromBody(body: string, fallback: string) {
  const firstLine = body.split("\n")[0] ?? "";
  if (firstLine.startsWith("# ")) return firstLine.replace(/^#\s+/, "").trim();
  return fallback;
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDir)) return [];

  const files = fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const fullPath = path.join(postsDir, file);
    const raw = fs.readFileSync(fullPath, "utf8");

    const { data, body } = parseFrontMatter(raw);

    const fileSlug = file.replace(/\.(md|mdx)$/, "");
    const slug = (data.slug?.trim() || fileSlug).trim();

    const title = (data.title?.trim() || inferTitleFromBody(body, fileSlug)).trim();

    const date = data.date?.trim();
    const description = data.description?.trim();

    return {
      slug,
      title,
      date,
      description,
      content: body,
    } satisfies Post;
  });

  // Sort newest first when dates exist
  posts.sort((a, b) => {
    const ad = a.date ? Date.parse(a.date) : 0;
    const bd = b.date ? Date.parse(b.date) : 0;
    return bd - ad;
  });

  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
