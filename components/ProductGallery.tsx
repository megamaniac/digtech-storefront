// components/ProductGallery.tsx
"use client";

import { useMemo, useState } from "react";

type Image = {
  src: string;
  alt?: string;
};

export default function ProductGallery({ images }: { images: Image[] }) {
  // De-duplicate by src while preserving order (optional but cleaner)
  const deduped = useMemo(() => {
    const seen = new Set<string>();
    const out: Image[] = [];
    for (const img of images || []) {
      if (!img?.src) continue;
      if (seen.has(img.src)) continue;
      seen.add(img.src);
      out.push(img);
    }
    return out;
  }, [images]);

  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  if (!deduped || deduped.length === 0) {
    return (
      <div className="aspect-[4/3] w-full rounded-2xl border border-[rgb(var(--border))] bg-black/30" />
    );
  }

  const safeIndex = Math.min(index, deduped.length - 1);
  const main = deduped[safeIndex];

  return (
    <div className="space-y-3">
      <div className="relative">
  <button
    type="button"
    onClick={() => setOpen(true)}
    className="group block w-full overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-black/30 text-left"
  >
    <img
      src={main.src}
      alt={main.alt || ""}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
    />
  </button>

  {deduped.length > 1 && (
    <>
      <button
        type="button"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/50 px-3 py-2 text-white hover:bg-black/70"
        onClick={(e) => {
          e.stopPropagation();
          setIndex((safeIndex - 1 + deduped.length) % deduped.length);
        }}
      >
        ←
      </button>

      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/50 px-3 py-2 text-white hover:bg-black/70"
        onClick={(e) => {
          e.stopPropagation();
          setIndex((safeIndex + 1) % deduped.length);
        }}
      >
        →
      </button>
    </>
  )}
</div>

      {deduped.length > 1 && (
  <>
    <div className="grid grid-cols-4 gap-3">
      {deduped.map((img, i) => (
        <button
          key={`${img.src}-${i}`}
          onClick={() => setIndex(i)}
          className={`overflow-hidden rounded-xl border ${
            i === safeIndex
              ? "border-white shadow-[0_0_0_2px_rgba(255,255,255,0.5)]"
              : "border-[rgb(var(--border))]"
          }`}
          type="button"
        >
          <img
            src={img.src}
            alt={img.alt || ""}
            className="aspect-square h-full w-full object-cover"
          />
        </button>
      ))}
    </div>

    {open && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        onClick={() => setOpen(false)}
      >
        <button
          type="button"
          className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white hover:bg-black/60"
          onClick={() => setOpen(false)}
        >
          Close
        </button>

        <button
          type="button"
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 px-4 py-3 text-white hover:bg-black/60"
          onClick={(e) => {
            e.stopPropagation();
            setIndex((safeIndex - 1 + deduped.length) % deduped.length);
          }}
        >
          ←
        </button>

        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 px-4 py-3 text-white hover:bg-black/60"
          onClick={(e) => {
            e.stopPropagation();
            setIndex((safeIndex + 1) % deduped.length);
          }}
        >
          →
        </button>

        <div
          className="max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={main.src}
            alt={main.alt || ""}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      </div>
    )}
  </>
)}
    </div>
  );
}
