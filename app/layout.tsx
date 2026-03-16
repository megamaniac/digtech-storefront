import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Dig.Tech",
  description: "Film/TV equipment for Digital Imaging Technicians",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
  <body className="relative min-h-screen bg-[rgb(var(--bg))] text-white">

    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
  <div className="absolute -top-40 -left-40 h-[600px] w-[1000px] rounded-full bg-[rgb(var(--accent))]/10 blur-[120px]" />
  <div className="absolute top-[40%] -right-40 h-[600px] w-[1000px] rounded-full bg-cyan-400/10 blur-[120px]" />
</div>

    <div className="relative z-10">
  <Header />
  <div className="mx-auto max-w-6xl px-4 py-10">{children}</div>
  <Footer />
</div>

  </body>
</html>
  );
}
