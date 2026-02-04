// lib/posts.ts
import fs from "fs";
import path from "path";

export type Post = {
  slug: string;
  title: string;
  date?: string; // ISO yyyy-mm-dd (recommended)
  description?: string;
  content: string; // markdown body (frontmatter removed)
};

const postsDir = path.join(process.cwd(), "content", "posts");

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const trimmed = raw.replace(/^\uFEFF/, ""); // strip BOM if present

  // Expect:
  // ---
  // key: "value"
  // key2: value
  // ---
  // body...
  if (!trimmed.startsWith("---")) {
    return { data: {}, body: trimmed };
  }

  const end = trimmed.indexOf("\n---", 3);
  if (end === -1) {
    return { data: {}, body: trimmed };
  }

  // Find the line that ends the frontmatter block
  const endLineIdx = trimmed.indexOf("\n", end + 1);
  const frontmatterBlock = trimmed.slice(3, end).trim();
  const body = (endLineIdx === -1 ? "" : trimmed.slice(endLineIdx + 1)).trim();

  const data: Record<string, string> = {};
  for (const line of frontmatterBlock.split("\n")) {
    const l = line.trim();
    if (!l || l.startsWith("#")) continue;
    const colon = l.indexOf(":");
    if (colon === -1) continue;

    const key = l.slice(0, colon).trim();
    let value = l.slice(colon + 1).trim();

    // remove wrapping quotes if present
    value = value.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");

    data[key] = value;
  }

  return { data, body };
}

function safeSlugFromFilename(file: string) {
  return file.replace(/\.md$/, "");
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDir)) return [];

  const files = fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"));

  const posts: Post[] = files.map((file) => {
    const fullPath = path.join(postsDir, file);
    const raw = fs.readFileSync(fullPath, "utf8");

    const { data, body } = parseFrontmatter(raw);

    const slug = (data.slug && data.slug.trim()) || safeSlugFromFilename(file);
    const title = (data.title && data.title.trim()) || slug;
    const date = data.date ? data.date.trim() : undefined;
    const description = data.description ? data.description.trim() : undefined;

    return {
      slug,
      title,
      date,
      description,
      content: body,
    };
  });

  // Newest first if date exists; otherwise stable alpha by title
  posts.sort((a, b) => {
    const ad = a.date ? Date.parse(a.date) : NaN;
    const bd = b.date ? Date.parse(b.date) : NaN;

    if (!Number.isNaN(ad) && !Number.isNaN(bd)) return bd - ad;
    if (!Number.isNaN(ad) && Number.isNaN(bd)) return -1;
    if (Number.isNaN(ad) && !Number.isNaN(bd)) return 1;

    return a.title.localeCompare(b.title);
  });

  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug);
}
