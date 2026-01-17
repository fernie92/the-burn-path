import Link from "next/link";

export default function BlogPage() {
  return (
    <main style={{ maxWidth: 720, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Blog</h1>
      <p>Posts are coming soon.</p>

      <p>
        <Link href="/">Back to home</Link>
      </p>
    </main>
  );
}
