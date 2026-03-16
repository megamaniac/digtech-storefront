// components/ProductCard.tsx
import Link from "next/link";
import Image from "next/image";
import type { WCProduct } from "@/lib/wc";

function firstImage(p: WCProduct) {
  const img = p.images?.[0];
  return img?.src ? img : null;
}

function secondImage(p: WCProduct) {
  const img = p.images?.[1];
  return img?.src ? img : null;
}

function money(product: WCProduct, amount: string) {
  // Store API shape: prices are minor units (e.g. "7000" for £70.00)
  const p: any = (product as any).prices;
  if (p?.currency_code) {
    const minor = p.currency_minor_unit ?? 2;
    const n = Number(amount);
    if (!Number.isFinite(n)) return null;

    const value = n / Math.pow(10, minor);
    return value.toLocaleString(undefined, {
      style: "currency",
      currency: p.currency_code || "GBP",
    });
  }

  // REST API shape: prices are major units strings (e.g. "70")
  const n = Number(amount);
  if (!Number.isFinite(n)) return null;

  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "GBP",
  });
}

function saleInfo(product: WCProduct) {
  const anyP: any = product as any;

  // Store API shape
  if (anyP.prices) {
    const p = anyP.prices;
    const reg = Number(p.regular_price);
    const sale = Number(p.sale_price);

    const onSale =
      Number.isFinite(reg) &&
      Number.isFinite(sale) &&
      reg > 0 &&
      sale > 0 &&
      sale < reg;

    return { onSale, reg, sale, mode: "store" as const };
  }

  // REST API shape
  const reg = Number(anyP.regular_price);
  const sale = Number(anyP.sale_price);

  const onSale =
    Number.isFinite(reg) &&
    Number.isFinite(sale) &&
    reg > 0 &&
    sale > 0 &&
    sale < reg;

  return { onSale, reg, sale, mode: "rest" as const };
}
function isNew(product: WCProduct, days = 14) {
  const raw = product.date_created || product.date_created_gmt;
  if (!raw) return false;

  const created = Date.parse(raw);
  if (!Number.isFinite(created)) return false;

  const ageDays = (Date.now() - created) / 86400000;
  return ageDays >= 0 && ageDays <= days;
}
export default function ProductCard({ product }: { product: WCProduct }) {
  const img = firstImage(product);
  const img2 = secondImage(product);

  const p = product.prices;
  const info = saleInfo(product);
  const anyP: any = product;
  const priceStr: string | undefined = anyP.prices?.price ?? anyP.price;
  const regStr: string | undefined = anyP.prices?.regular_price ?? anyP.regular_price;
  const saleStr: string | undefined = anyP.prices?.sale_price ?? anyP.sale_price;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition"
    >
      <div className="p-3">
  <div className="relative aspect-square overflow-hidden rounded-xl bg-black/30">
  {/* Badge row */}
  <div className="pointer-events-none absolute left-2 right-2 top-2 z-10 flex items-start justify-between gap-2">
    {/* Sale badge */}
    {info.onSale ? (
      <div className="rounded-full bg-[rgb(var(--accent))] px-2 py-1 text-[11px] font-semibold text-black">
        {(() => {
          const pct = Math.round(((info.reg - info.sale) / info.reg) * 100);
          return Number.isFinite(pct) && pct > 0 ? `-${pct}%` : "Sale";
        })()}
      </div>
    ) : (
      <span />
    )}

    {/* New badge */}
    {isNew(product, 61) ? (
      <div className="rounded-full border border-white/15 bg-black/50 px-2 py-1 text-[11px] font-semibold text-white/90">
        New
      </div>
    ) : (
      <span />
    )}
  </div>

  {/* Images */}
  {img ? (
    <>
      <Image
        src={img.src}
        alt={img.alt || product.name}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        className="object-cover transition-opacity duration-300 group-hover:opacity-0"
      />

      {img2 ? (
        <Image
          src={img2.src}
          alt={img2.alt || product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      ) : null}
    </>
  ) : (
    <div className="absolute inset-0 grid place-items-center text-xs text-white/50">
      No image
    </div>
  )}
</div>

        <div className="mt-3 space-y-1">
          <div className="line-clamp-2 text-sm text-white/90">{product.name}</div>

          {info.onSale && regStr && saleStr ? (
  <div className="text-sm text-white/80">
    <del className="mr-2 text-white/40">{money(product, regStr) ?? ""}</del>
    <span>{money(product, saleStr) ?? ""}</span>
  </div>
) : priceStr ? (
  <div className="text-sm text-white/80">{money(product, priceStr) ?? ""}</div>
) : (
  <div className="text-sm text-white/50">—</div>
)}
        </div>
      </div>
    </Link>
  );
}
