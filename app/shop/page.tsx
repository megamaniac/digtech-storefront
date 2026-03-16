// app/shop/page.tsx
import type { Metadata } from "next";
import { wcGetCategories, wcGetProducts, type WCCategory } from "@/lib/wc";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import ShopToolbar from "@/components/ShopToolbar";

export const metadata: Metadata = {
  title: "Shop | Dig.Tech",
  description: "Browse Dig.Tech products.",
};

type SortKey = "date" | "price_asc" | "price_desc" | "popularity" | "rating" | "title";

function parseIntSafe(v: string | undefined | null, fallback: number) {
  if (!v) return fallback;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function clampPerPage(n: number) {
  return Math.min(48, Math.max(12, n));
}

function sortToQuery(sort: SortKey): { orderby?: any; order?: any } {
  switch (sort) {
    case "price_asc":
      return { orderby: "price", order: "asc" };
    case "price_desc":
      return { orderby: "price", order: "desc" };
    case "popularity":
      return { orderby: "popularity", order: "desc" };
    case "rating":
      return { orderby: "rating", order: "desc" };
    case "title":
      return { orderby: "title", order: "asc" };
    case "date":
    default:
      return { orderby: "date", order: "desc" };
  }
}

function findCategoryId(categories: WCCategory[], slug: string | null) {
  if (!slug) return undefined;
  const cat = categories.find((c) => c.slug === slug);
  return cat?.id;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const catSlug = typeof sp.cat === "string" ? sp.cat : null;
  const q = typeof sp.q === "string" ? sp.q : "";
  const sort = (typeof sp.sort === "string" ? sp.sort : "date") as SortKey;

  const page = parseIntSafe(typeof sp.page === "string" ? sp.page : null, 1);
  const per_page = clampPerPage(
    parseIntSafe(typeof sp.per_page === "string" ? sp.per_page : null, 24)
  );

  const categories = await wcGetCategories();
  const categoryId = findCategoryId(categories, catSlug);

  const { orderby, order } = sortToQuery(sort);

  // Fetch one extra item to determine "hasNext" without relying on headers
  const products = await wcGetProducts({
    page,
    per_page: per_page + 1,
    categoryId,
    search: q,
    orderby,
    order,
  });

  const hasNext = products.length > per_page;
  const pageProducts = products.slice(0, per_page);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16">
      <ShopToolbar categories={categories} resultCount={pageProducts.length} />

      {pageProducts.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <div className="text-base font-semibold text-white/90">No results</div>
          <div className="mt-2 text-sm text-white/60">
            Try a different category, adjust sorting, or change the search query.
          </div>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {pageProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </section>

          <Pagination page={page} hasNext={hasNext} />
        </>
      )}
    </main>
  );
}
