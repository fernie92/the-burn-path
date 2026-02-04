// app/blog/[slug]/page.tsx
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";
import { remark } from "remark";
import html from "remark-html";

function formatDate(date?: string) {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return { title: "Not Found | The Burn Path" };

  return {
    title: `${post.title} | The Burn Path`,
    description: post.description || `Read "${post.title}" on The Burn Path.`,
  };
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
      <h1 style={{ marginBottom: "0.25rem" }}>{post.title}</h1>
      {post.date ? (
        <div style={{ marginBottom: "1.5rem", color: "#666", fontSize: "0.95rem" }}>
          {formatDate(post.date)}
        </div>
      ) : (
        <div style={{ marginBottom: "1.5rem" }} />
      )}

      <article dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </main>
  );
}
