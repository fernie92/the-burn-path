import Link from "next/link";

export default function AboutPage() {
  return (
    <main style={{ maxWidth: 720, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>About</h1>
      <p>Short version: mindset, fitness, money. Long version coming soon.</p>

      <p>
        <Link href="/">Back to home</Link>
      </p>
    </main>
  );
}
