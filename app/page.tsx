// app/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { wcGetProducts } from "@/lib/wc";
import ProductCard from "@/components/ProductCard";
import Hero from "@/components/Hero";

export const metadata: Metadata = {
  title: "Dig.Tech",
  description: "Film & TV technical equipment. Modern tools for image workflows.",
};

export default async function Home() {
  const products = await wcGetProducts({
    page: 1,
    per_page: 8,
    orderby: "date",
    order: "desc",
    featured: true,
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 space-y-10">
      <Hero />

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold text-white/90">Shop by category</h2>
          <Link href="/shop" className="text-sm text-white/70 hover:text-white/90">
            View all →
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              title: "Enclosures",
              desc: "DeckLink and I/O-ready builds.",
              href: "/shop?cat=enclosures",
            },
            {
              title: "Stands & Holders",
              desc: "Rigging, mounting, cradles.",
              href: "/shop?cat=stands-holders-and-cradles",
            },
            {
              title: "Accessories",
              desc: "Cables and enclosure add-ons.",
              href: "/shop?cat=accessories",
            },
          ].map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.06]"
            >
              <div className="flex items-center justify-between">
                <div className="text-base font-semibold text-white/90">{c.title}</div>
                <div className="text-white/50 transition group-hover:text-white/70">→</div>
              </div>
              <div className="mt-2 text-sm text-white/60">{c.desc}</div>

              <div className="mt-4 h-px w-full bg-gradient-to-r from-[rgb(var(--accent))]/35 via-white/10 to-transparent" />
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white/90">Featured</h2>
            <p className="mt-1 text-sm text-white/60">
              A curated selection of current Dig.Tech products.
            </p>
          </div>

          <Link href="/shop" className="text-sm text-white/70 hover:text-white/90">
            View all →
          </Link>
        </div>

        <div className="grid gap-3 lg:grid-cols-12">
          {products[0] && (
            <Link
              href={`/product/${products[0].slug}`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] lg:col-span-12"
            >
              <div className="grid min-h-[260px] lg:grid-cols-[1.2fr_1fr]">
                <div className="relative z-10 flex flex-col justify-center p-6 lg:p-8">
                  <div className="inline-flex w-fit rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/70">
                    Featured
                  </div>

                  <h3 className="mt-4 max-w-xl text-2xl font-semibold leading-tight text-white/90 lg:text-3xl">
                    {products[0].name}
                  </h3>

                  {products[0].prices?.price ? (
                    <div className="mt-3 text-lg font-semibold text-white">
                      {(
                        Number(products[0].prices.price) /
                        10 ** (products[0].prices.currency_minor_unit ?? 2)
                      ).toLocaleString(undefined, {
                        style: "currency",
                        currency: products[0].prices.currency_code || "GBP",
                      })}
                    </div>
                  ) : null}

                  <div className="mt-4 text-sm text-white/60">View product →</div>
                </div>

                <div className="relative min-h-[260px] overflow-hidden">
                  {products[0].images?.[0]?.src ? (
                    <img
                      src={products[0].images[0].src}
                      alt={products[0].images[0].alt || products[0].name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : null}

                  <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--surface))] via-[rgb(var(--surface))]/55 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-transparent lg:to-black/50" />
                </div>
              </div>
            </Link>
          )}

          {products.length > 1 && (
            <div className="grid grid-cols-2 gap-3 lg:col-span-12 lg:grid-cols-3">
              {products.slice(1, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
