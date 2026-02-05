import { getAllPosts, type Post } from "@/lib/posts";
import { notFound } from "next/navigation";
import { remark } from "remark";
import html from "remark-html";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

function formatDate(input: string) {
  // Accepts "YYYY-MM-DD" or ISO strings
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;

  const posts: Post[] = getAllPosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) notFound();

  const processed = await remark().use(html).process(post.content);
  const contentHtml = processed.toString();

  return (
    <main className="container">
      <header className="postHeader">
        <h1 className="postTitle">{post.title}</h1>

        {"date" in post && post.date ? (
          <p className="postMeta">{formatDate(String(post.date))}</p>
        ) : null}

        {"description" in post && post.description ? (
          <p className="postLead">{String(post.description)}</p>
        ) : null}
      </header>

      <article
        className="prose"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </main>
  );
}
