// components/AddToCartLink.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AddToCartLink({
  productId,
  quantity = 1,
  className,
}: {
  productId: number;
  quantity?: number;
  className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAddToCart() {
    try {
      setLoading(true);

      const existingCartToken =
        typeof window !== "undefined"
          ? localStorage.getItem("woo-cart-token")
          : null;

      // 1. bootstrap cart / nonce
      const cartRes = await fetch("/wp-json/wc/store/v1/cart", {
        credentials: "include",
        headers: {
          Accept: "application/json",
          ...(existingCartToken ? { "Cart-Token": existingCartToken } : {}),
        },
      });

      if (!cartRes.ok) {
        throw new Error(`Cart bootstrap failed: ${cartRes.status}`);
      }

      const nonce =
        cartRes.headers.get("Nonce") || cartRes.headers.get("nonce");

      const bootstrapCartToken =
        cartRes.headers.get("Cart-Token") || cartRes.headers.get("cart-token");

      if (bootstrapCartToken) {
        localStorage.setItem("woo-cart-token", bootstrapCartToken);
      }

      if (!nonce) {
        throw new Error("Missing Woo Store API nonce");
      }

      // 2. add item
      const addRes = await fetch(
        `/wp-json/wc/store/v1/cart/add-item?id=${encodeURIComponent(
          productId
        )}&quantity=${encodeURIComponent(quantity)}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            Nonce: nonce,
            ...(bootstrapCartToken
              ? { "Cart-Token": bootstrapCartToken }
              : existingCartToken
              ? { "Cart-Token": existingCartToken }
              : {}),
          },
        }
      );

      if (!addRes.ok) {
        const text = await addRes.text().catch(() => "");
        throw new Error(`Add-to-cart failed: ${addRes.status} ${text}`);
      }

      const addCartToken =
        addRes.headers.get("Cart-Token") || addRes.headers.get("cart-token");

      if (addCartToken) {
        localStorage.setItem("woo-cart-token", addCartToken);
      }

      window.dispatchEvent(new Event("cart-updated"));
      window.dispatchEvent(new Event("cart-open"));
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Could not add item to cart.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={loading}
      className={
        className ??
        "inline-flex items-center justify-center rounded-xl bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-60"
      }
    >
      {loading ? "Adding…" : "Add to cart"}
    </button>
  );
}
