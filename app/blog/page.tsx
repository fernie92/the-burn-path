// app/blog/page.tsx
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

function formatDate(date?: string) {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export const metadata = {
  title: "Blog | The Burn Path",
  description: "Posts on mindset, fitness, money, and building financial freedom.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main style={{ maxWidth: 720, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Blog</h1>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: "1.5rem 0" }}>
          {posts.map((post) => (
            <li key={post.slug} style={{ padding: "1rem 0", borderBottom: "1px solid #eee" }}>
              <Link
                href={`/blog/${post.slug}`}
                style={{
                  display: "inline-block",
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                {post.title}
              </Link>

              <div style={{ marginTop: "0.25rem", fontSize: "0.9rem", color: "#666" }}>
                {formatDate(post.date)}
              </div>

              {post.description ? (
                <p style={{ marginTop: "0.5rem", marginBottom: 0, color: "#333" }}>
                  {post.description}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
