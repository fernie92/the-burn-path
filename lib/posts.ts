// lib/posts.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Post = {
  slug: string;
  title: string;
  date?: string; // ISO "YYYY-MM-DD"
  description?: string;
  content: string; // markdown content without frontmatter
};

const postsDir = path.join(process.cwd(), "content", "posts");

function safeReadDir(dir: string): string[] {
  try {
    return fs.readdirSync(dir);
  } catch {
    return [];
  }
}

export function getAllPosts(): Post[] {
  const files = safeReadDir(postsDir).filter((f) => f.endsWith(".md"));

  const posts = files
    .map((file) => {
      const fullPath = path.join(postsDir, file);
      const raw = fs.readFileSync(fullPath, "utf8");

      const { data, content } = matter(raw);

      const fileSlug = file.replace(/\.md$/, "");
      const slug =
        typeof data.slug === "string" && data.slug.trim() ? data.slug.trim() : fileSlug;

      const title =
        typeof data.title === "string" && data.title.trim()
          ? data.title.trim()
          : slug.replace(/-/g, " ");

      const date = typeof data.date === "string" ? data.date : undefined;
      const description =
        typeof data.description === "string" && data.description.trim()
          ? data.description.trim()
          : undefined;

      return { slug, title, date, description, content };
    })
    // newest first when date is present
    .sort((a, b) => {
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
