// app/product/[slug]/page.tsx
import { AddToCartLink } from "@/components/AddToCartLink";
import ProductGallery from "@/components/ProductGallery";
import { formatPrice, getProductBySlug, listProducts } from "@/lib/wc";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  
  if (!product) {
    return (
      <main className="space-y-6">
        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
          <h1 className="text-2xl font-semibold">Product not found</h1>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            The product slug <span className="font-mono text-white">{slug}</span>{" "}
            did not match any product.
          </p>
          <a
            href="/shop"
            className="mt-4 inline-flex rounded-xl border border-[rgb(var(--border))] bg-black/20 px-4 py-2 text-sm hover:border-white/30"
          >
            Back to shop
          </a>
        </div>
      </main>
    );
  }

  const price = formatPrice(product.prices);

  const primaryCat = product.categories?.[0]; // {name, slug}
  const primaryCatSlug = primaryCat?.slug;
  const category = primaryCat?.name;
const inStock = product.stock_status === "instock";
const isFeatured = product.featured === true;

  // Related products from same category when possible
  const pool = await listProducts({
    categorySlug: primaryCatSlug,
    perPage: 24,
  });

  const relatedFromCat = pool.filter((p) => p.id !== product.id).slice(0, 4);

  // Fallback if no category / empty result
  const fallback =
    relatedFromCat.length >= 1
      ? relatedFromCat
      : (await listProducts({ perPage: 24 }))
          .filter((p) => p.id !== product.id)
          .slice(0, 4);

  const related = relatedFromCat.length ? relatedFromCat : fallback;

  const relatedViewAllHref = primaryCatSlug ? `/shop?cat=${primaryCatSlug}` : "/shop";

  return (
    <main className="space-y-10">
      {/* Breadcrumb */}
      <div className="text-sm text-[rgb(var(--muted))]">
        <a className="hover:text-white" href="/shop">
          Shop
        </a>
        {primaryCatSlug ? (
          <>
            {" "}
            <span className="opacity-60">/</span>{" "}
            <a className="hover:text-white" href={relatedViewAllHref}>
              {primaryCat?.name || primaryCatSlug}
            </a>
          </>
        ) : null}{" "}
        <span className="opacity-60">/</span>{" "}
        <span className="text-white">{product.name}</span>
      </div>

     <section className="grid items-start gap-8 lg:grid-cols-2">
        <div className="space-y-6">
  <ProductGallery images={product.images || []} />
  <div className="h-[1200px]" />
</div>

       <div className="space-y-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-white/15 bg-[rgb(var(--surface))]/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <h1 className="text-2xl font-semibold leading-tight md:text-3xl">{product.name}</h1>
            {product.sku && (
  <div className="mt-1 text-xs text-[rgb(var(--muted))]">
    SKU: <span className="font-mono">{product.sku}</span>
  </div>
)}
            <div className="flex items-center gap-2 text-xs">

    {category && (
  <a
    href={`/shop?cat=${primaryCatSlug}`}
    className="rounded-md border border-[rgb(var(--border))] bg-black/30 px-2 py-1 hover:border-white/30"
  >
    {category}
  </a>
)}

    {isFeatured && (
      <span className="rounded-md border border-yellow-500/40 bg-yellow-500/10 px-2 py-1 text-yellow-300">
        Featured
      </span>
    )}

    <span
      className={`rounded-md border px-2 py-1 ${
        inStock
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-red-500/30 bg-red-500/10 text-red-300"
      }`}
    >
      {inStock ? "In stock" : "Out of stock"}
    </span>

  </div>

  <div className="mt-4 h-px w-full bg-gradient-to-r from-white/15 via-white/10 to-transparent" />

            {(() => {
  const p = product.prices;
  if (!p?.price) {
    return <div className="mt-3 text-sm text-[rgb(var(--muted))]">Price unavailable</div>;
  }

  const reg = Number(p.regular_price);
  const sale = Number(p.sale_price);

  const onSale =
    Number.isFinite(reg) &&
    Number.isFinite(sale) &&
    reg > 0 &&
    sale > 0 &&
    sale < reg;

  if (onSale) {
    return (
      <div className="mt-4 flex items-baseline gap-3">
        <del className="text-white/50">
          {formatPrice({ price: p.regular_price, currency_code: p.currency_code })}
        </del>
        <div className="text-2xl font-semibold tracking-tight text-white">
          {formatPrice({ price: p.sale_price, currency_code: p.currency_code })}
        </div>
        <div className="text-xs rounded-full bg-[rgb(var(--accent))] px-2 py-1 font-semibold text-black">
          Sale
        </div>
      </div>
    );
  }

  return <div className="mt-4 text-2xl font-semibold tracking-tight text-white">{price}</div>;
})()}

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <AddToCartLink productId={product.id} />
              <a
                href="/checkout"
                className="inline-flex items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-black/20 px-4 py-2 text-sm hover:border-white/30"
              >
                Checkout
              </a>
            </div>

            {product.short_description ? (
              <div className="prose prose-invert mt-6 max-w-none text-sm prose-p:my-2 prose-a:text-[rgb(var(--accent))]">
                <div dangerouslySetInnerHTML={{ __html: product.short_description }} />
              </div>
            ) : null}
          </div>

          {product.description ? (
            <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
              <div className="text-sm font-semibold">Details</div>
              <div className="prose prose-invert mt-3 max-w-none text-sm prose-p:my-2 prose-a:text-[rgb(var(--accent))]">
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            </div>
          ) : null}
        </div>
        </div>
      </section>

      {/* Related */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold">Related products</h2>
          <a className="text-sm text-[rgb(var(--muted))] hover:text-white" href={relatedViewAllHref}>
            View all →
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <a
              key={p.id}
              href={`/product/${p.slug}`}
              className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-3 hover:border-white/30"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-black/30">
                {p.images?.[0]?.src ? (
                  <img
                    src={p.images[0].src}
                    alt={p.images[0].alt || p.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <div className="mt-3 text-sm font-semibold">{p.name}</div>

              {p.prices?.price ? (
                <div className="mt-1 text-sm text-[rgb(var(--muted))]">
                  {formatPrice(p.prices)}
                </div>
              ) : null}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
