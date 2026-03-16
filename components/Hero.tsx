// components/Hero.tsx
import Link from "next/link";
import Image from "next/image";
export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
      {/* Background texture */}
      <div className="pointer-events-none absolute inset-0">
      {/* promo photo wash */}
<div
  className="absolute inset-0 opacity-[0.5]"
  style={{
    backgroundImage: "url(/promo.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "70% 55%",
    filter: "grayscale(1) contrast(1.05)",
  }}
/>

{/* fade to blend with hero */}
<div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--surface))] via-[rgb(var(--surface))]/70 to-transparent" />
{/* subtle highlight on the right */}
<div className="absolute inset-0 bg-gradient-to-l from-white/[0.06] via-transparent to-transparent" />
{/* vignette */}
<div className="absolute inset-0 [box-shadow:inset_0_0_140px_rgba(0,0,0,0.10)]" />
        {/* soft glow */}
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[rgb(var(--accent))]/15 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
            maskImage: "radial-gradient(ellipse at center, black 55%, transparent 100%)",
          }}
        />

        {/* scanline */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/[0.03] to-white/0" />
      </div>

      {/* Content */}
      <div className="relative p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-[rgb(var(--muted))]">
              <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--accent))]" />
              Film/TV • DIT workflow
            </div>

            <h1 className="mt-4 text-2xl font-semibold leading-tight md:text-4xl">
              Modern on-set accessories for{" "}
              <br />
              <span className="text-[rgb(var(--accent))]">Film and TV Professionals</span>
            </h1>

            <p className="mt-3 text-sm text-[rgb(var(--muted))] md:text-base">
              Enclosures, stands/holders and accessories designed for fast setup and repeatable results.
            </p>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-xl bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
              >
                Shop all
              </Link>

              <Link
                href="/shop?cat=enclosures"
                className="inline-flex items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-black/20 px-4 py-2 text-sm text-white hover:border-white/30"
              >
                Browse enclosures
              </Link>
            </div>
          </div>

          {/* Right-side mini stats */}
          {/* Right-side mini stats */}
<div className="mt-2 grid grid-cols-2 gap-3 md:mt-0 md:w-[320px]">
  {[
    { k: "International", v: "Worldwide Shipping" },
    { k: "DIT-first", v: "On-set workflow" },
    { k: "Custom Designs", v: "Compact and rugged" },
    { k: "Bulletproof Service", v: "Keeping your rig running" },
  ].map((s) => (
    <div
      key={s.k}
      className="rounded-xl border border-white/15 bg-black/25 p-3 transition hover:border-white/25 hover:bg-black/25"
    >
      <div className="text-xs text-[rgb(var(--muted))]">{s.k}</div>
      <div className="mt-1 text-sm font-semibold">{s.v}</div>
    </div>
  ))}
</div>


        </div>
      </div>
    </section>
  );
}
