// lib/wc.ts
import "server-only";

const WC_STORE_API_BASE =
  process.env.WC_STORE_API_BASE ?? "https://wp.digtech.uk/wp-json/wc/store/v1";

export type WCImage = {
  id?: number;
  src: string;
  alt?: string;
};

export type WCPrices = {
  price: string; // minor units, string
  currency_code: string;
};

export type WCProduct = {
  id: number;
  name: string;
  slug: string;
  images: WCImage[];
  price_html?: string;
  prices?: WCPrices;
  categories?: {
    id: number;
    name: string;
    slug: string;
    date_created?: string;
date_created_gmt?: string;
  }[];
  description?: string;
  short_description?: string;
};

export type WCCategory = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${WC_STORE_API_BASE}${path}`, {
    next: { revalidate: 60 },
  
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Woo API ${res.status} ${text}`);
  }

  return res.json();
}
async function fetchRest<T>(path: string): Promise<T> {
  const base = process.env.WC_REST_URL!;
  const ck = process.env.WC_CONSUMER_KEY!;
  const cs = process.env.WC_CONSUMER_SECRET!;

  const url = new URL(`${base}/wp-json/wc/v3${path.startsWith("/") ? path : `/${path}`}`);
  url.searchParams.set("consumer_key", ck);
  url.searchParams.set("consumer_secret", cs);

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error(`Woo REST ${res.status}`);
  }
async function restGetProductBySlug(slug: string) {
  const products = await fetchRest<WCProduct[]>(
    `/products${qs({ slug, per_page: 1 })}`
  );
  return products[0] ?? null;
}
  return res.json();
}

function qs(params: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams();

  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    sp.set(k, String(v));
  }

  const s = sp.toString();
  return s ? `?${s}` : "";
}

export function formatPrice(prices?: WCPrices) {
  if (!prices?.price) return null;
  const value = Number(prices.price) / 100;
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: prices.currency_code || "GBP",
  });
}

/* -------------------------
   ORIGINAL API (compatibility)
------------------------- */

export async function listCategories() {
  return fetchJson<WCCategory[]>(`/products/categories${qs({ per_page: 100 })}`);
}

export async function listProducts(params?: {
  categorySlug?: string;
  perPage?: number;
}) {
  const perPage = params?.perPage ?? 24;

  if (!params?.categorySlug) {
    return fetchJson<WCProduct[]>(`/products${qs({ per_page: perPage })}`);
  }

  const cats = await listCategories();
  const cat = cats.find((c) => c.slug === params.categorySlug);

  return fetchJson<WCProduct[]>(
    `/products${qs({
      per_page: perPage,
      category: cat?.id,
    })}`
  );
}

export async function getProductBySlug(slug: string) {
  const products = await fetchJson<WCProduct[]>(
    `/products${qs({ slug, per_page: 1 })}`
  );

  return products[0] ?? null;
}

/* -------------------------
   NEW API (still available)
------------------------- */

export async function wcGetProducts(params: {
  page?: number;
  per_page?: number;
  categoryId?: number;
  search?: string;
  featured?: boolean;
  orderby?: "date" | "price" | "popularity" | "rating" | "title";
  order?: "asc" | "desc";
}) {
  return fetchRest<WCProduct[]>(
  `/products${qs({
    page: params.page,
    per_page: params.per_page,
    category: params.categoryId,
    search: params.search,
    featured: params.featured ? "true" : undefined,
    orderby: params.orderby,
    order: params.order,
  })}`
);
}

export async function wcGetCategories() {
  return listCategories();
}

export async function wcGetProductBySlug(slug: string) {
  return restGetProductBySlug(slug);
}
