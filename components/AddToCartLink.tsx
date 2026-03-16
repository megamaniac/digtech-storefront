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

      // Step 1: fetch cart to obtain a valid Nonce header
      const cartRes = await fetch("/wp-json/wc/store/v1/cart", {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!cartRes.ok) {
        throw new Error(`Cart bootstrap failed: ${cartRes.status}`);
      }

      const nonce =
        cartRes.headers.get("Nonce") ||
        cartRes.headers.get("nonce");

      if (!nonce) {
        throw new Error("Missing Woo Store API nonce");
      }

      // Step 2: add item to cart
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
          },
        }
      );

      if (!addRes.ok) {
        const text = await addRes.text().catch(() => "");
        throw new Error(`Add-to-cart failed: ${addRes.status} ${text}`);
      }

      // Step 3: go to headless cart page
      router.push("/cart");
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
