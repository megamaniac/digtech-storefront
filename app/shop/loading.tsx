// app/shop/loading.tsx
export default function LoadingShop() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16">
      <div className="sticky top-0 z-20 -mx-4 mb-6 border-b border-white/10 bg-black/70 backdrop-blur px-4 py-4">
        <div className="mx-auto w-full max-w-6xl space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-5 w-24 rounded bg-white/10" />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="h-9 w-full sm:w-72 rounded-xl bg-white/10" />
              <div className="h-9 w-44 rounded-xl bg-white/10" />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-7 w-24 shrink-0 rounded-full bg-white/10" />
            ))}
          </div>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
          >
            <div className="aspect-square rounded-xl bg-white/10" />
            <div className="mt-3 h-4 w-4/5 rounded bg-white/10" />
            <div className="mt-2 h-4 w-2/5 rounded bg-white/10" />
          </div>
        ))}
      </section>
    </main>
  );
}
