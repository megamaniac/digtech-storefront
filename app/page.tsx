import { listProducts } from "@/lib/wc";

export default async function Home() {
  const products = await listProducts();

  return (
    <main style={{ padding: 24, background: "#0b0b0f", minHeight: "100vh", color: "#f2f2f2" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Dig.Tech</h1>
      <p style={{ opacity: 0.75, marginBottom: 20 }}>V1 storefront (headless Woo + WP checkout)</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {products.map((p) => (
          <a
            key={p.id}
            href={`/product/${p.slug}`}
            style={{
              border: "1px solid #24262f",
              borderRadius: 14,
              padding: 12,
              textDecoration: "none",
              color: "inherit",
              background: "#12121a",
            }}
          >
            <div style={{ aspectRatio: "4/3", background: "#0f0f15", borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
              {p.images?.[0]?.src ? (
                <img
                  src={p.images[0].src}
                  alt={p.images[0].alt || p.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : null}
            </div>
            <div style={{ fontWeight: 600 }}>{p.name}</div>
            <div style={{ opacity: 0.7, fontSize: 12, marginTop: 4 }}>/product/{p.slug}</div>
          </a>
        ))}
        {products.length === 0 ? <div>No products published yet.</div> : null}
      </div>

      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <a
          href="/cart"
          style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #24262f", textDecoration: "none", color: "inherit" }}
        >
          Cart (WP)
        </a>
        <a
          href="/checkout"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #24262f",
            textDecoration: "none",
            color: "inherit",
            background: "#ffd24a",
          }}
        >
          Checkout (WP)
        </a>
      </div>
    </main>
  );
}