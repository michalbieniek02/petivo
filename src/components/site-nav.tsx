"use client";
import Link from "next/link";
import { CartButton } from "./cart-drawer";

const links = [
  { href: "/#kolekcja", label: "Sklep" },
  { href: "/#funkcje", label: "Petivo Auto" },
  { href: "/#jak-działa", label: "Jak działa" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-10 h-16 glass border-b border-white/[0.06]">
      <Link href="/" className="text-xl font-black tracking-tight text-gradient">PETIVO</Link>
      <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-white transition-colors duration-200">
            {l.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <CartButton />
        <Link href="/#kolekcja" className="btn-primary text-sm px-5 py-2.5">Zobacz produkty</Link>
      </div>
    </nav>
  );
}
