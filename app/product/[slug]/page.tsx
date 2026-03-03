export default function Product({ params }: { params: { slug: string } }) {
  return (
    <main style={{ padding: 24 }}>
      <a href="/">&larr; Back</a>
      <h1 style={{ fontSize: 28, marginTop: 12 }}>{params.slug}</h1>
      <p style={{ opacity: 0.8, marginTop: 8 }}>Product page UI comes next.</p>
      <div style={{ marginTop: 18 }}>
        <a href="/checkout" style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #24262f" }}>
          Checkout (WP)
        </a>
      </div>
    </main>
  );
}