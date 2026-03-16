// components/ShopToolbar.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { WCCategory } from "@/lib/wc";

type SortKey = "date" | "price_asc" | "price_desc" | "popularity" | "rating" | "title";

function applyParams(
  pathname: string,
  current: URLSearchParams,
  patch: Record<string, string | null>
) {
  const sp = new URLSearchParams(current);
  for (const [k, v] of Object.entries(patch)) {
    if (v === null || v === "") sp.delete(k);
    else sp.set(k, v);
  }
  // Reset pagination when filters change
  sp.delete("page");
  const q = sp.toString();
  return q ? `${pathname}?${q}` : pathname;
}

export default function ShopToolbar({
  categories,
  resultCount,
}: {
  categories: WCCategory[];
  resultCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCat = searchParams?.get("cat") ?? "";
  const currentQ = searchParams?.get("q") ?? "";
  const currentSort = (searchParams?.get("sort") as SortKey) ?? "date";

  const [q, setQ] = useState(currentQ);

  useEffect(() => setQ(currentQ), [currentQ]);

  // Debounce search input -> URL
  useEffect(() => {
    const handle = setTimeout(() => {
      const nextHref = applyParams(pathname, new URLSearchParams(searchParams?.toString() ?? ""), {
        q: q.trim() ? q.trim() : null,
      });
      router.replace(nextHref, { scroll: false });
    }, 350);

    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const hasActiveFilters = useMemo(() => {
    return Boolean(currentCat || currentQ || (currentSort && currentSort !== "date"));
  }, [currentCat, currentQ, currentSort]);

  const setCat = (slug: string | null) => {
    const nextHref = applyParams(
      pathname,
      new URLSearchParams(searchParams?.toString() ?? ""),
      { cat: slug }
    );
    router.push(nextHref, { scroll: false });
  };

  const setSort = (sort: SortKey) => {
    const nextHref = applyParams(
      pathname,
      new URLSearchParams(searchParams?.toString() ?? ""),
      { sort: sort === "date" ? null : sort }
    );
    router.push(nextHref, { scroll: false });
  };

  const clearAll = () => {
    router.push(pathname, { scroll: false });
  };

  return (
    <div className="sticky top-0 z-20 -mx-4 mb-6 border-b border-white/10 bg-black/70 backdrop-blur px-4 py-4">
      <div className="mx-auto w-full max-w-6xl space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-semibold text-white/90">Shop</h1>
            <div className="text-xs text-white/50">
              {resultCount} {resultCount === 1 ? "item" : "items"}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products…"
                className="w-full sm:w-72 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/90 placeholder:text-white/40 outline-none focus:border-white/20"
              />
            </div>

            <select
              value={currentSort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
            >
              <option value="date">Newest</option>
              <option value="popularity">Popularity</option>
              <option value="rating">Rating</option>
              <option value="title">Name (A–Z)</option>
              <option value="price_asc">Price (Low → High)</option>
              <option value="price_desc">Price (High → Low)</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/[0.06]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setCat(null)}
            className={[
              "shrink-0 rounded-full border px-3 py-1.5 text-xs",
              currentCat
                ? "border-white/10 text-white/70 hover:bg-white/[0.06]"
                : "border-white/20 bg-white/[0.08] text-white/90",
            ].join(" ")}
          >
            All
          </button>

          {categories.map((c) => {
            const active = c.slug === currentCat;
            return (
              <button
                key={c.id}
                onClick={() => setCat(c.slug)}
                className={[
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs",
                  active
                    ? "border-white/20 bg-white/[0.08] text-white/90"
                    : "border-white/10 text-white/70 hover:bg-white/[0.06]",
                ].join(" ")}
                title={`${c.name} (${c.count})`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
