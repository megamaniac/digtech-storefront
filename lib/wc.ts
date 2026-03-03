const BASE = process.env.WC_STORE_API_BASE!;

async function wc<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    cache: "no-store",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`WC API ${res.status}`);
  return res.json();
}

export type WCProduct = {
  id: number;
  name: string;
  slug: string;
  images: { src: string; alt: string }[];
};

export async function listProducts() {
  return wc<WCProduct[]>("/products?per_page=12");
}