"use client";
import Link from "next/link";
import { CartButton } from "./cart-drawer";

const links = [
  { href: "/#kolekcja", label: "Sklep" },
  { href: "/#funkcje", label: "Karmnik z kamerą" },
  { href: "/#jak-działa", label: "Jak działa" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteNav() {
  return (
    <>
      <a href="#main-content" className="skip-link">Przejdź do treści</a>
      <nav aria-label="Główna nawigacja" className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-3 sm:px-10 h-16 glass border-b border-white/[0.06]">
        <Link href="/" aria-label="Petivo — strona główna" className="text-xl font-black tracking-tight text-gradient">PETIVO</Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-white transition-colors duration-200">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <CartButton />
          <Link href="/#kolekcja" className="btn-primary min-h-11 text-sm px-4 sm:px-5 inline-flex items-center">
            <span className="sm:hidden">Produkty</span>
            <span className="hidden sm:inline">Zobacz produkty</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
