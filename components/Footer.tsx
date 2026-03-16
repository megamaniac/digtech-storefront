export function Footer() {
  return (
    <footer className="border-t border-[rgb(var(--border))]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-sm font-semibold">Dig.Tech</div>
            <div className="mt-2 text-sm text-[rgb(var(--muted))]">
              Film/TV equipment for Digital Imaging Technicians.
            </div>
          </div>

          <div className="flex gap-10 text-sm">
            <div className="flex flex-col gap-2 text-[rgb(var(--muted))]">
              <div className="text-white">Shop</div>
              <a className="hover:text-white" href="/shop?cat=enclosures">Enclosures</a>
              <a className="hover:text-white" href="/shop?cat=stands-holders">Stands & holders</a>
              <a className="hover:text-white" href="/shop?cat=accessories">Accessories</a>
            </div>

            <div className="flex flex-col gap-2 text-[rgb(var(--muted))]">
              <div className="text-white">Company</div>
              <a className="hover:text-white" href="/about">About us</a>
              <a className="hover:text-white" href="/contact">Contact</a>
              <a className="hover:text-white" href="/policies">Policies</a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-xs text-[rgb(var(--muted))]">
          © {new Date().getFullYear()} Dig.Tech
        </div>
      </div>
    </footer>
  );
}