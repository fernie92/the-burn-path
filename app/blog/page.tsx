// app/blog/page.tsx
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main style={{ maxWidth: 720, margin: "4rem auto", padding: "0 1rem" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>Blog</h1>

      {posts.length === 0 ? (
        <p style={{ color: "#555" }}>No posts yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {posts.map((post) => (
            <li key={post.slug} style={{ padding: "1rem 0", borderBottom: "1px solid #eee" }}>
              <Link
                href={`/blog/${post.slug}`}
                style={{ fontSize: "1.1rem", fontWeight: 600, textDecoration: "none" }}
              >
                {post.title}
              </Link>

              <div style={{ marginTop: "0.25rem", color: "#666", fontSize: "0.9rem" }}>
                {post.date ? new Date(post.date).toLocaleDateString() : null}
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
