// app/cart/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CartItemImage = {
  src?: string;
  alt?: string;
  thumbnail?: string;
};

type CartItem = {
  key: string;
  id: number;
  name: string;
  quantity: number;
  images?: CartItemImage[];
  prices?: {
    currency_code?: string;
    currency_minor_unit?: number;
  };
  totals?: {
    line_subtotal?: string;
    line_total?: string;
    currency_code?: string;
    currency_minor_unit?: number;
  };
  permalink?: string;
};

type CartResponse = {
  items: CartItem[];
  totals?: {
    total_items?: string;
    total_items_tax?: string;
    total_price?: string;
    currency_code?: string;
    currency_minor_unit?: number;
  };
};

function formatMinorCurrency(
  value?: string,
  currencyCode = "GBP",
  minorUnit = 2
) {
  if (!value) return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;

  return (n / 10 ** minorUnit).toLocaleString(undefined, {
    style: "currency",
    currency: currencyCode,
  });
}

export default function CartPage() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadCart() {
    try {
      setLoading(true);
      setError(null);

      const cartToken =
        typeof window !== "undefined"
          ? localStorage.getItem("woo-cart-token")
          : null;

      const res = await fetch("/wp-json/wc/store/v1/cart", {
        credentials: "include",
        headers: {
          Accept: "application/json",
          ...(cartToken ? { "Cart-Token": cartToken } : {}),
        },
      });

      if (!res.ok) {
        throw new Error(`Cart API ${res.status}`);
      }

      const nextCartToken =
        res.headers.get("Cart-Token") || res.headers.get("cart-token");

      if (nextCartToken) {
        localStorage.setItem("woo-cart-token", nextCartToken);
      }

      const data = (await res.json()) as CartResponse;
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load cart");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <main className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Cart</h1>
          <p className="mt-1 text-sm text-white/60">
            Review your items before checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={loadCart}
          className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/[0.06]"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/60">
          Loading cart…
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">
          Could not load cart. {error}
        </div>
      ) : !cart || !cart.items || cart.items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <div className="text-base font-semibold text-white/90">
            Your cart is empty
          </div>
          <div className="mt-2 text-sm text-white/60">
            Add a product to begin checkout.
          </div>

          <Link
            href="/shop"
            className="mt-5 inline-flex rounded-xl bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="space-y-3">
            {cart.items.map((item) => {
              const image = item.images?.[0];
              const currencyCode =
                item.totals?.currency_code ||
                item.prices?.currency_code ||
                cart.totals?.currency_code ||
                "GBP";

              const minorUnit =
                item.totals?.currency_minor_unit ??
                item.prices?.currency_minor_unit ??
                cart.totals?.currency_minor_unit ??
                2;

              return (
                <div
                  key={item.key}
                  className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-[96px_1fr_auto]"
                >
                  <div className="overflow-hidden rounded-xl bg-black/30">
                    {image?.src ? (
                      <img
                        src={image.src}
                        alt={image.alt || item.name}
                        className="h-24 w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-24 w-full place-items-center text-xs text-white/40">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-white/90">
                      {item.name}
                    </div>

                    <div className="text-xs text-white/50">
                      Quantity: {item.quantity}
                    </div>

                    {item.permalink ? (
                      <a
                        href={item.permalink}
                        className="text-xs text-white/60 hover:text-white/90"
                      >
                        View product →
                      </a>
                    ) : null}
                  </div>

                  <div className="text-right text-sm text-white/80">
                    {formatMinorCurrency(
                      item.totals?.line_total,
                      currencyCode,
                      minorUnit
                    ) || "—"}
                  </div>
                </div>
              );
            })}
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="text-base font-semibold text-white/90">
                Order summary
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-white/60">
                <span>Items total</span>
                <span>
                  {formatMinorCurrency(
                    cart.totals?.total_items,
                    cart.totals?.currency_code || "GBP",
                    cart.totals?.currency_minor_unit ?? 2
                  ) || "—"}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm text-white/60">
                <span>Total</span>
                <span className="text-base font-semibold text-white/90">
                  {formatMinorCurrency(
                    cart.totals?.total_price,
                    cart.totals?.currency_code || "GBP",
                    cart.totals?.currency_minor_unit ?? 2
                  ) || "—"}
                </span>
              </div>

              <a
                href="/checkout"
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
              >
                Continue to checkout
              </a>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
