import Image from "next/image";
import Link from "next/link";
import { POLICIES } from "@/lib/policies";
import { ConsentSettingsLink } from "./consent-and-pixel";

export function SiteFooter() {
  return (
    <footer className="on-ink py-14 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Image src="/brand/petivo-logo-cream-v2.png" alt="Petivo" width={1323} height={273} sizes="240px" className="h-10 w-auto" />
          <p className="font-display text-lg text-background/90 mt-5 max-w-xs leading-snug">
            Legowiska, maty i akcesoria na spacer dla psa i kota.
          </p>
          <p className="text-sm text-background/80 leading-relaxed mt-4">
            <a href="mailto:kontakt@petivo.shop" className="hover:text-background transition-colors underline underline-offset-4 decoration-accent-primary">
              kontakt@petivo.shop
            </a>
            <br />
            <Link href="/kontakt" className="hover:text-background transition-colors underline underline-offset-4 decoration-accent-primary">
              Formularz kontaktowy
            </Link>
          </p>
        </div>
        <nav aria-label="Sklep">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-neutral-warm mb-4">Sklep</p>
          <ul className="space-y-2.5 text-sm text-background/80">
            <li><Link href="/#kolekcja" className="hover:text-background transition-colors">Produkty</Link></li>
            <li><Link href="/#jak-wybrac" className="hover:text-background transition-colors">Jak dobrać legowisko</Link></li>
            <li><Link href="/#faq" className="hover:text-background transition-colors">FAQ</Link></li>
            <li><Link href="/dostawa" className="hover:text-background transition-colors">Dostawa</Link></li>
          </ul>
        </nav>
        <nav aria-label="Informacje prawne">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-neutral-warm mb-4">Informacje</p>
          <ul className="space-y-2.5 text-sm text-background/80">
            {POLICIES.filter((p) => p.slug !== "dostawa").map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}`} className="hover:text-background transition-colors">{p.title}</Link>
              </li>
            ))}
            <li><ConsentSettingsLink className="hover:text-background transition-colors" /></li>
          </ul>
        </nav>
      </div>
      <p className="max-w-6xl mx-auto text-xs text-background/65 mt-12 pt-6 border-t border-background/15">© 2026 Petivo. Wszelkie prawa zastrzeżone.</p>
    </footer>
  );
}
