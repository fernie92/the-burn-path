export default function Home() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" }}>
      <header style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 42, margin: 0 }}>The Burn Path</h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, marginTop: 12 }}>
          Blazing the path to financial freedom.
        </p>
      </header>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>Coming soon</h2>
        <ul style={{ lineHeight: 1.9, paddingLeft: 18 }}>
          <li>Mindset, Fitness, Money</li>
          <li>Markdown-based posts</li>
          <li>Weekly publishing cadence</li>
        </ul>
      </section>

      <footer style={{ marginTop: 48, opacity: 0.7 }}>
        <p style={{ margin: 0 }}>© {new Date().getFullYear()} The Burn Path</p>
      </footer>
    </main>
  );
}
