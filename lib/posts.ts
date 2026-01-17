// lib/posts.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Post = {
  slug: string;
  title: string;
  content: string;
};

const contentDir = path.join(process.cwd(), "content", "posts");

export function getAllPosts(): Post[] {
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith(".md"));

  return files.map(file => {
    const slug = file.replace(/\.md$/, "");
    const fullPath = path.join(contentDir, file);
    const raw = fs.readFileSync(fullPath, "utf8");

    const { data, content } = matter(raw);

    return {
      slug: data.slug ?? slug,
      title: data.title ?? slug,
      content
    };
  });
}





