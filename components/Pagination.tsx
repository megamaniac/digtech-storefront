// components/Pagination.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function buildHref(pathname: string, sp: URLSearchParams, page: number) {
  const next = new URLSearchParams(sp);
  if (page <= 1) next.delete("page");
  else next.set("page", String(page));
  return `${pathname}?${next.toString()}`;
}

export default function Pagination({
  page,
  hasNext,
}: {
  page: number;
  hasNext: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pages = useMemo(() => {
    // Simple window around current page
    const out: number[] = [];
    const start = Math.max(1, page - 2);
    const end = page + 2; // we don't know last page; keep it compact
    for (let i = start; i <= end; i++) out.push(i);
    return out;
  }, [page]);

  const prevDisabled = page <= 1;
  const nextDisabled = !hasNext;

  const baseSp = new URLSearchParams(searchParams?.toString() ?? "");

  return (
    <nav className="mt-8 flex items-center justify-center gap-2">
      <Link
        aria-disabled={prevDisabled}
        tabIndex={prevDisabled ? -1 : 0}
        className={[
          "rounded-xl border border-white/10 px-3 py-2 text-sm",
          prevDisabled ? "opacity-40 pointer-events-none" : "hover:bg-white/[0.06]",
        ].join(" ")}
        href={buildHref(pathname, baseSp, Math.max(1, page - 1))}
      >
        Prev
      </Link>

      <div className="flex items-center gap-1">
        {pages.map((p) => {
          const active = p === page;
          return (
            <Link
              key={p}
              className={[
                "min-w-10 text-center rounded-xl border px-3 py-2 text-sm",
                active
                  ? "border-white/20 bg-white/[0.08]"
                  : "border-white/10 hover:bg-white/[0.06]",
              ].join(" ")}
              href={buildHref(pathname, baseSp, p)}
            >
              {p}
            </Link>
          );
        })}
      </div>

      <Link
        aria-disabled={nextDisabled}
        tabIndex={nextDisabled ? -1 : 0}
        className={[
          "rounded-xl border border-white/10 px-3 py-2 text-sm",
          nextDisabled ? "opacity-40 pointer-events-none" : "hover:bg-white/[0.06]",
        ].join(" ")}
        href={buildHref(pathname, baseSp, page + 1)}
      >
        Next
      </Link>
    </nav>
  );
}
