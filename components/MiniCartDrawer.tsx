"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CartItemImage = {
  src?: string;
  alt?: string;
};

type CartItem = {
  key: string;
  id: number;
  name: string;
  quantity: number;
  images?: CartItemImage[];
  totals?: {
    line_total?: string;
    currency_code?: string;
    currency_minor_unit?: number;
  };
};

type CartResponse = {
  items?: CartItem[];
  totals?: {
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

export function MiniCartDrawer() {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadCart() {
    try {
      setLoading(true);

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

      if (!res.ok) return;

      const nextCartToken =
        res.headers.get("Cart-Token") || res.headers.get("cart-token");

      if (nextCartToken) {
        localStorage.setItem("woo-cart-token", nextCartToken);
      }

      const data = (await res.json()) as CartResponse;
      setCart(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const onOpen = async () => {
      await loadCart();
      setOpen(true);
    };

    const onCartUpdate = async () => {
      await loadCart();
    };

    window.addEventListener("cart-open", onOpen);
    window.addEventListener("cart-updated", onCartUpdate);

    return () => {
      window.removeEventListener("cart-open", onOpen);
      window.removeEventListener("cart-updated", onCartUpdate);
    };
  }, []);

  return (
    <>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setOpen(false)}
            aria-label="Close mini cart"
          />

          <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-white/10 bg-[rgb(var(--bg))] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <div className="text-base font-semibold text-white/90">
                  Cart
                </div>
                <div className="text-sm text-white/60">
                  Recently added items
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/[0.06]"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/60">
                  Loading cart…
                </div>
              ) : !cart?.items || cart.items.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/60">
                  Your cart is empty.
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.items.map((item) => {
                    const image = item.images?.[0];
                    const currencyCode =
                      item.totals?.currency_code ||
                      cart.totals?.currency_code ||
                      "GBP";

                    const minorUnit =
                      item.totals?.currency_minor_unit ??
                      cart.totals?.currency_minor_unit ??
                      2;

                    return (
                      <div
                        key={item.key}
                        className="grid grid-cols-[72px_1fr_auto] gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                      >
                        <div className="overflow-hidden rounded-xl bg-black/30">
                          {image?.src ? (
                            <img
                              src={image.src}
                              alt={image.alt || item.name}
                              className="h-[72px] w-full object-cover"
                            />
                          ) : (
                            <div className="grid h-[72px] place-items-center text-xs text-white/40">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-white/90">
                            {item.name}
                          </div>
                          <div className="mt-1 text-xs text-white/50">
                            Qty: {item.quantity}
                          </div>
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
                </div>
              )}
            </div>

            <div className="border-t border-white/10 p-4">
              <div className="mb-4 flex items-center justify-between text-sm text-white/60">
                <span>Total</span>
                <span className="text-base font-semibold text-white/90">
                  {formatMinorCurrency(
                    cart?.totals?.total_price,
                    cart?.totals?.currency_code || "GBP",
                    cart?.totals?.currency_minor_unit ?? 2
                  ) || "—"}
                </span>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/cart"
                  className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm text-white/80 hover:bg-white/[0.06]"
                  onClick={() => setOpen(false)}
                >
                  View cart
                </Link>

                <a
                  href="/checkout"
                  className="flex-1 rounded-lg bg-[rgb(var(--accent))] px-4 py-3 text-center text-sm font-semibold text-black hover:opacity-90"
                  onClick={() => setOpen(false)}
                >
                  Checkout
                </a>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
