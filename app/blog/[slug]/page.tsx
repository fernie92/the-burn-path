// app/blog/[slug]/page.tsx
import { getAllPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import { remark } from "remark";
import html from "remark-html";

type Props = {
  params: Promise<{ slug: string }>;
};

function formatPostDate(date?: string): string | null {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;

  const post = getAllPosts().find((p) => p.slug === slug);
  if (!post) notFound();

  const processedContent = await remark().use(html).process(post.content);
  const contentHtml = processedContent.toString();

  const dateLabel = formatPostDate(post.date);

  return (
    <div className="container">
      <header className="postHeader">
        <h1 className="postTitle">{post.title}</h1>

        {dateLabel ? <p className="postMeta">{dateLabel}</p> : null}

        {post.description ? (
          <p className="postLead">{post.description}</p>
        ) : null}
      </header>

      <article
        className="prose"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
