"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { CartButton } from "./cart-drawer";

const links = [
  { href: "/#kolekcja", label: "Sklep" },
  { href: "/#jak-wybrac", label: "Jak dobrać" },
  { href: "/dostawa", label: "Dostawa" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    const onResize = () => window.innerWidth >= 768 && setMenuOpen(false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  return (
    <>
      <a href="#main-content" className="skip-link">Przejdź do treści</a>
      <nav aria-label="Główna nawigacja" className="fixed top-0 left-0 right-0 z-40 bg-[#06060e]/80 backdrop-blur-xl backdrop-saturate-150 border-b border-white/[0.07]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-3 sm:px-6 h-16">
          <Link href="/" aria-label="Petivo — strona główna" className="inline-flex items-center shrink-0">
            <Image src="/brand/petivo-logo-o.png" alt="Petivo" width={1323} height={273} priority sizes="200px" className="h-8 sm:h-10 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-7 text-sm text-white/70">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white transition-colors duration-200">
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <CartButton />
            <Link href="/#kolekcja" className="hidden md:inline-flex btn-primary min-h-11 text-sm px-5 items-center">
              Zobacz produkty
            </Link>
            <button type="button" onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
              className="md:hidden h-11 w-11 flex items-center justify-center rounded-full text-white/80 hover:text-white bg-white/[0.06] border border-white/10">
              {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-white/[0.06] bg-[var(--panel)] px-3 pb-4 pt-2">
            <ul>
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={() => setMenuOpen(false)}
                    className="flex items-center min-h-12 px-3 rounded-xl text-base font-medium text-white/85 hover:bg-white/[0.05] hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/kontakt" onClick={() => setMenuOpen(false)}
                  className="flex items-center min-h-12 px-3 rounded-xl text-base font-medium text-white/85 hover:bg-white/[0.05] hover:text-white">
                  Kontakt
                </Link>
              </li>
            </ul>
            <Link href="/#kolekcja" onClick={() => setMenuOpen(false)} className="btn-primary min-h-12 mt-2 w-full inline-flex items-center justify-center text-sm">
              Zobacz produkty
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
