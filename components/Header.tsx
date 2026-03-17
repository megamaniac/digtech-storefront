"use client";

import Image from "next/image";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]/80 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5">
        <a href="/" className="flex items-center gap-2">
          <div className="relative h-15 w-auto">
  <Image
    src="/logo.png"
    alt="Dig.Tech"
    width={629}
    height={204}
    className="h-[60px] w-auto"
    priority
  />
</div>
        </a>

        <nav className="hidden items-center gap-10 text-med text-[rgb(var(--muted))] md:flex">
          <a className="hover:text-white" href="/shop">Shop</a>
          <a className="hover:text-white" href="/about">About us</a>
          <a className="hover:text-white" href="/contact">Contact us</a>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href="https://wp.digtech.uk/cart"
            className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-5 py-2 text-sm hover:border-white/30"
          >
            Cart
          </a>
          <a
            href="https://wp.digtech.uk/checkout"
            className="rounded-lg bg-[rgb(var(--accent))] px-3 py-2 text-sm font-semibold text-black hover:opacity-90"
          >
            Checkout
          </a>
        </div>

        {/* Mobile button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-1.5 text-sm md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </div>

      {/* Mobile menu */}
      {open ? (
        <div className="border-t border-[rgb(var(--border))] bg-[rgb(var(--bg))] md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <div className="flex flex-col gap-3 text-sm text-[rgb(var(--muted))]">
              <a className="hover:text-white" href="/shop" onClick={() => setOpen(false)}>Shop</a>
              <a className="hover:text-white" href="/about" onClick={() => setOpen(false)}>About us</a>
              <a className="hover:text-white" href="/contact" onClick={() => setOpen(false)}>Contact us</a>
              <div className="mt-2 flex gap-2">
                <a
                  href="https://wp.digtech.uk/cart"
                  className="flex-1 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-center text-sm hover:border-white/30"
                  onClick={() => setOpen(false)}
                >
                  Cart
                </a>
                <a
                  href="https://wp.digtech.uk/checkout"
                  className="flex-1 rounded-lg bg-[rgb(var(--accent))] px-3 py-2 text-center text-sm font-semibold text-black hover:opacity-90"
                  onClick={() => setOpen(false)}
                >
                  Checkout
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
