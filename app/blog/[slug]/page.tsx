// app/blog/[slug]/page.tsx
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";
import { remark } from "remark";
import html from "remark-html";

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = getPostBySlug(slug);
  if (!post) notFound();

  const processed = await remark().use(html).process(post.content);
  const contentHtml = processed.toString();

  return (
    <main style={{ maxWidth: 720, margin: "4rem auto", padding: "0 1rem" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>{post.title}</h1>

      {post.date ? (
        <div style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
          {new Date(post.date).toLocaleDateString()}
        </div>
      ) : (
        <div style={{ marginBottom: "1.5rem" }} />
      )}

      <article dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </main>
  );
}
