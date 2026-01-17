import { getAllPosts, type Post } from "@/lib/posts";
import { notFound } from "next/navigation";
import { remark } from "remark";
import html from "remark-html";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const posts: Post[] = getAllPosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) notFound();

  const processed = await remark().use(html).process(post.content);
  const contentHtml = processed.toString();

  return (
    <main style={{ maxWidth: 720, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>{post.title}</h1>
      <article dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </main>
  );
}








