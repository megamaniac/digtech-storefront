"use client";

export function AddToCartLink({
  productId,
  quantity = 1,
  className,
}: {
  productId: number;
  quantity?: number;
  className?: string;
}) {
  const href = `https://wp.digtech.uk/cart/?add-to-cart=${encodeURIComponent(
    productId
  )}&quantity=${encodeURIComponent(quantity)}`;

  return (
    <a
      href={href}
      className={
        className ??
        "inline-flex items-center justify-center rounded-xl bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
      }
    >
      Add to cart
    </a>
  );
}
