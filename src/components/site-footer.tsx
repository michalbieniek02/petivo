import Image from "next/image";
import Link from "next/link";
import { POLICIES } from "@/lib/policies";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Image src="/brand/petivo-logo-o.png" alt="Petivo" width={1323} height={273} sizes="240px" className="h-12 w-auto" />
          <p className="text-xs text-white/65 leading-relaxed mt-4">
            <a href="mailto:kontakt@petivo.shop" className="hover:text-white transition-colors underline underline-offset-4">
              kontakt@petivo.shop
            </a>
            <br />
            <Link href="/kontakt" className="hover:text-white transition-colors underline underline-offset-4">
              Formularz kontaktowy
            </Link>
          </p>
        </div>
        <nav aria-label="Sklep">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/60 mb-4">Sklep</p>
          <ul className="space-y-2 text-sm text-white/65">
            <li><Link href="/#kolekcja" className="hover:text-white transition-colors">Produkty</Link></li>
            <li><Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link></li>
            <li><Link href="/dostawa" className="hover:text-white transition-colors">Dostawa</Link></li>
          </ul>
        </nav>
        <nav aria-label="Informacje prawne">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/60 mb-4">Informacje</p>
          <ul className="space-y-2 text-sm text-white/65">
            {POLICIES.filter((p) => p.slug !== "dostawa").map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}`} className="hover:text-white transition-colors">{p.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="max-w-6xl mx-auto text-xs text-white/50 mt-10">© 2026 Petivo. Wszelkie prawa zastrzeżone.</p>
    </footer>
  );
}
