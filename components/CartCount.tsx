"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CartResponse = {
  items?: Array<{
    quantity: number;
  }>;
};

export function CartCount() {
  const [count, setCount] = useState(0);

  async function loadCartCount() {
    try {
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
      const total = (data.items || []).reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );

      setCount(total);
    } catch {
      // ignore silently in header
    }
  }

  useEffect(() => {
    loadCartCount();

    const onFocus = () => loadCartCount();
    const onStorage = () => loadCartCount();

    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return (
    <Link
      href="/cart"
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/80 hover:bg-white/[0.06] hover:text-white"
    >
      <span>Cart</span>
      <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[rgb(var(--accent))] px-1.5 py-0.5 text-xs font-semibold text-black">
        {count}
      </span>
    </Link>
  );
}
