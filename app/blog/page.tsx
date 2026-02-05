// app/blog/page.tsx
import Link from "next/link";
import { getAllPosts, type Post } from "@/lib/posts";

function formatDate(date?: string) {
  if (!date) return null;
  const ts = Date.parse(date);
  if (Number.isNaN(ts)) return date; // show raw if weird
  return new Date(ts).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts: Post[] = getAllPosts();

  return (
    <main style={{ maxWidth: 720, margin: "4rem auto", padding: "0 1rem" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>Blog</h1>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {posts.map((post) => {
            const prettyDate = formatDate(post.date);

            return (
              <li
                key={post.slug}
                style={{
                  padding: "1rem 0",
                  borderTop: "1px solid #e5e5e5",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Link
                    href={`/blog/${post.slug}`}
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      color: "inherit",
                      width: "fit-content",
                    }}
                  >
                    {post.title}
                  </Link>

                  {prettyDate ? (
                    <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>
                      {prettyDate}
                    </div>
                  ) : null}

                  {post.description ? (
                    <p style={{ margin: 0, lineHeight: 1.5, opacity: 0.9 }}>
                      {post.description}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
