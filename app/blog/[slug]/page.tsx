// app/blog/[slug]/page.tsx
import { getAllPosts } from "@/lib/posts";
import { notFound } from "next/navigation";

type Params = { slug: string };
type Props = {
  params: Promise<Params>;
};

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;

  const post = getAllPosts().find((p) => p.slug === slug);
  if (!post) notFound();

  // supports either pre-rendered HTML (contentHtml) or plain text (content)
  const html = (post as any).contentHtml as string | undefined;
  const text = (post as any).content as string | undefined;

  return (
    <article className="container">
      <header className="postHeader">
        <h1 className="postTitle">{post.title}</h1>
        <p className="postMeta">
          {new Date(post.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
        {post.description ? <p className="postLead">{post.description}</p> : null}
      </header>

      <div className="prose">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <p>{text ?? ""}</p>
        )}
      </div>
    </article>
  );
}
