"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import { Reveal } from "@/components/scroll-reveal";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ProductGrid, type Filter } from "@/components/product-grid";
import { formatPrice, type Product } from "@/lib/products";
import { CATEGORIES, type CategoryId } from "@/lib/categories";
import { FREE_SHIPPING_FROM, SHIPPING_PL } from "@/lib/shop";
import { ArrowRight, ArrowUpRight, Truck, RotateCcw, ShieldCheck, Lock } from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

/** Hero photos, in this order (products without a scene photo are skipped). */
const HERO_HANDLES = [
  "legowisko-donut-puszyste",
  "legowisko-domek-dla-kota",
  "legowisko-pianka-3d-zmywalna-poszewka",
  "pokrowiec-samochodowy-dla-psa",
];

/** Preferred photo for each category tile. */
const CATEGORY_COVER: Partial<Record<CategoryId, string>> = {
  legowiska: "legowisko-pianka-3d-zmywalna-poszewka",
  spacer: "szelki-ze-smycza-dla-malego-psa",
  zabawa: "mata-wechowa-dla-psa",
};

const CATEGORY_BLURB: Partial<Record<CategoryId, string>> = {
  legowiska: "Puszyste, z pianki i domki do chowania się",
  spacer: "Szelki, miska na wyjazd i ochrona kanapy w aucie",
  zabawa: "Maty węchowe, do lizania i drapak",
};

const promises = [
  { icon: Truck,       title: `Darmowa dostawa od ${FREE_SHIPPING_FROM} zł`, desc: `W Polsce, poniżej tej kwoty ${SHIPPING_PL} zł` },
  { icon: RotateCcw,   title: "14 dni na zwrot",       desc: "Bez podawania przyczyny" },
  { icon: ShieldCheck, title: "2 lata na reklamację",  desc: "Zgodnie z prawem konsumenckim" },
  { icon: Lock,        title: "Bezpieczna płatność",   desc: "Karta lub PayPal przez Shopify" },
];

const sizingSteps = [
  { t: "Zmierz pupila",            d: "Zmierz długość od nosa do nasady ogona, gdy pupil leży wyciągnięty, oraz jego średnicę, gdy śpi zwinięty w kłębek." },
  { t: "Wybierz rodzaj legowiska", d: "Okrągłe i puszyste dla tych, co się zwijają. Płaskie z pianki dla tych, co się wyciągają. Domek dla kotów, które lubią kryjówki." },
  { t: "Dodaj kilka centymetrów",  d: "Wybierz rozmiar o kilka centymetrów większy. Wymiary w opisach są przybliżone (1–3 cm różnicy), a w razie wątpliwości napisz do nas." },
];

const faqs = [
  { q: "Jak dobrać rozmiar legowiska?", a: "Zmierz pupila, gdy leży wyciągnięty i gdy śpi zwinięty, i wybierz rozmiar o kilka centymetrów większy. Przy każdym produkcie podajemy wymiary w centymetrach. Są przybliżone, bo ręczny pomiar może się różnić o 1–3 cm." },
  { q: "Ile trwa dostawa?", a: `Zamówienia wysyłamy od producentów — dostawa trwa zwykle 5–10 dni roboczych. W Polsce dostawa jest darmowa od ${FREE_SHIPPING_FROM} zł, poniżej ${SHIPPING_PL} zł.` },
  { q: "Czy mogę zwrócić produkt?", a: "Tak. Masz 14 dni na odstąpienie od umowy bez podania przyczyny, a reklamacje przyjmujemy przez 2 lata zgodnie z prawem konsumenckim. Wzór formularza odstąpienia znajdziesz na stronie „Formularz odstąpienia od umowy”." },
  { q: "Jak prać legowisko?", a: "Zalecamy delikatne pranie ręczne i suszenie na powietrzu. W legowisku z pianki 3D zdejmowaną poszewkę możesz wyprać osobno." },
  { q: "Kto jest producentem produktów?", a: "Petivo to nazwa sklepu. Przy każdym produkcie podajemy producenta, podmiot odpowiedzialny w Unii Europejskiej oraz ogólne ostrzeżenia bezpieczeństwa." },
  { q: "Jak mogę zapłacić?", a: "Kartą płatniczą lub przez PayPal. Płatność obsługuje Shopify, a dane karty nie trafiają do nas." },
];

function SectionHeading({ eyebrow, title, children, center = false }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode; center?: boolean }) {
  return (
    <div className={center ? "text-center mx-auto max-w-2xl" : "max-w-2xl"}>
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className="text-[2rem] leading-[1.08] sm:text-5xl lg:text-[3.4rem]">{title}</h2>
      {children && <p className="text-ink/80 text-base sm:text-lg leading-relaxed mt-4">{children}</p>}
    </div>
  );
}

const photoOf = (p: Product) => p.gallery.find((g) => g.kind === "photo");

export function Landing({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<Filter>("all");

  const withPhoto = (handles: string[]) => handles.map((h) => products.find((p) => p.handle === h)).filter((p): p is Product => !!p && !!photoOf(p));
  const hero = [...withPhoto(HERO_HANDLES), ...products.filter((p) => !HERO_HANDLES.includes(p.handle) && photoOf(p))].slice(0, 2);

  const categories = CATEGORIES.map((c) => {
    const inCat = products.filter((p) => p.category === c.id);
    if (!inCat.length) return null;
    const preferred = inCat.find((p) => p.handle === CATEGORY_COVER[c.id] && photoOf(p)) ?? inCat.find((p) => photoOf(p));
    return { ...c, count: inCat.length, from: Math.min(...inCat.map((p) => p.minPrice)), cover: preferred ? photoOf(preferred)!.src : null };
  }).filter((x) => x !== null);

  // a photo not already used in the hero, for the closing block
  const ctaPhoto = products.filter((p) => !hero.includes(p)).map(photoOf).find(Boolean)?.src ?? null;

  const cheapest = products.length ? Math.min(...products.map((p) => p.minPrice)) : null;

  const pickCategory = (id: Filter) => {
    setCategory(id);
    document.getElementById("kolekcja")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <MotionConfig reducedMotion="user">
    <main id="main-content" className="min-h-dvh bg-paper text-ink overflow-x-hidden">

      <SiteNav />

      {/* ─── HERO ─── */}
      <section className="grain relative overflow-hidden pt-24 pb-14 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 px-4 sm:px-6">
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <p className="eyebrow mb-5 sm:mb-6">Legowiska · spacer · zabawa</p>
            <h1 className="text-[2.6rem] leading-[1.02] min-[400px]:text-5xl sm:text-6xl lg:text-[4.6rem]">
              Miękko w domu<span className="font-sans font-normal">,</span>{" "}
              <span className="accent-script">dobrze na&nbsp;spacerze</span>
            </h1>
            <p className="text-base sm:text-lg text-ink/80 max-w-md mt-6 leading-relaxed">
              Puszyste legowiska, maty do zabawy i akcesoria na spacery i w podróż — dla psa i kota.
              Opisy po polsku i dane producenta przy każdym produkcie.
            </p>

            <div className="flex flex-col min-[400px]:flex-row gap-3 mt-8 sm:mt-10">
              <Link href="#kolekcja" className="btn-primary min-h-12 px-7 inline-flex items-center justify-center gap-2 text-base">
                Zobacz produkty <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="#jak-wybrac" className="btn-ghost min-h-12 px-6 inline-flex items-center justify-center text-sm">
                Jak dobrać legowisko
              </Link>
            </div>

            {cheapest !== null && (
              <p className="mt-7 text-sm text-ink/75">
                {products.length} produktów od <strong className="font-semibold text-ink">{formatPrice(cheapest)}</strong>
                <span aria-hidden="true" className="mx-2 text-camel">●</span>
                darmowa dostawa od {FREE_SHIPPING_FROM} zł
              </p>
            )}
          </motion.div>

          {/* two real product photos: a tall arch and a smaller rounded card, each linking to its product */}
          {hero.length === 2 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto w-full max-w-[30rem] lg:max-w-none">
              <div aria-hidden="true" className="absolute -right-6 top-6 h-40 w-40 sm:h-56 sm:w-56 rounded-full bg-camel/45" />
              <Link href={`/produkt/${hero[0].handle}`}
                className="group relative block ml-auto w-[78%] aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2rem] bg-sand shadow-[0_40px_80px_-40px_rgba(27,54,68,0.55)]">
                <Image src={photoOf(hero[0])!.src} alt={hero[0].name} fill priority sizes="(max-width: 1024px) 80vw, 36vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              </Link>
              <Link href={`/produkt/${hero[1].handle}`}
                className="group absolute left-0 bottom-[-6%] w-[46%] rounded-[1.5rem] bg-card p-2 shadow-[0_30px_60px_-30px_rgba(27,54,68,0.6)] rotate-[-3deg] hover:rotate-0 transition-transform duration-300">
                <span className="relative block aspect-square overflow-hidden rounded-[1.1rem] bg-sand">
                  <Image src={photoOf(hero[1])!.src} alt={hero[1].name} fill sizes="(max-width: 1024px) 45vw, 20vw" className="object-cover" />
                </span>
                <span className="flex items-center justify-between gap-2 px-1.5 pt-2 pb-0.5">
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold text-ink truncate">{hero[1].name}</span>
                    <span className="block text-xs text-ink/75 tabular-nums">od {formatPrice(hero[1].minPrice)}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-cocoa" aria-hidden="true" />
                </span>
              </Link>
              <span className="absolute right-6 bottom-4 hidden sm:inline-flex rounded-full bg-ink text-cream px-4 py-2 text-xs font-semibold shadow-lg">
                {hero[0].name.split(" — ")[0]} · od {formatPrice(hero[0].minPrice)}
              </span>
            </motion.div>
          )}
        </div>
      </section>

      {/* ─── PROMISES ─── */}
      <section aria-label="Zakupy w Petivo" className="on-ink">
        <ul className="max-w-6xl mx-auto px-4 sm:px-6 py-7 sm:py-8 grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
          {promises.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex items-start gap-3">
              <Icon className="h-5 w-5 mt-0.5 shrink-0 text-camel" aria-hidden="true" />
              <span>
                <span className="block text-sm font-semibold text-cream">{title}</span>
                <span className="block text-xs text-cream/75 mt-0.5 leading-relaxed">{desc}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ─── CATEGORIES ─── */}
      {categories.length > 1 && (
        <section className="pt-16 sm:pt-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <SectionHeading eyebrow="Kategorie" title={<>Czego <span className="accent-script">szukasz?</span></>} />
            </Reveal>
            <ul className={`grid gap-4 sm:gap-5 ${categories.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
              {categories.map((c, i) => (
                <Reveal as="li" key={c.id} delay={i * 0.06}>
                  <button type="button" onClick={() => pickCategory(c.id)}
                    className="group relative block w-full text-left overflow-hidden rounded-[1.75rem] bg-sand aspect-[4/3] md:aspect-[3/4]">
                    {c.cover && (
                      <Image src={c.cover} alt="" fill sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
                    )}
                    <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-cream">
                      <span className="block font-display text-2xl sm:text-3xl leading-tight">{c.label}</span>
                      {CATEGORY_BLURB[c.id] && <span className="block text-sm text-cream/85 mt-1.5">{CATEGORY_BLURB[c.id]}</span>}
                      <span className="mt-4 flex items-center justify-between gap-3">
                        <span className="text-sm text-cream/90">{c.count} {c.count === 1 ? "produkt" : c.count < 5 ? "produkty" : "produktów"} · od {formatPrice(c.from)}</span>
                        <span className="h-10 w-10 shrink-0 rounded-full bg-cream text-ink flex items-center justify-center group-hover:bg-camel transition-colors">
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </span>
                    </span>
                  </button>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ─── COLLECTION ─── */}
      <section id="kolekcja" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-8 sm:mb-10">
            <SectionHeading eyebrow="Sklep" title={<>Wszystkie <span className="accent-script">produkty</span></>}>
              Legowiska dla psów i kotów, szelki ze smyczą, pokrowiec do samochodu oraz maty i drapak na zajęcie pupila.
            </SectionHeading>
          </Reveal>
          <ProductGrid products={products} category={category} onCategory={setCategory} />
        </div>
      </section>

      {/* ─── SIZING GUIDE ─── */}
      <section id="jak-wybrac" className="grain bg-sand py-16 sm:py-24 px-4 sm:px-6 scroll-mt-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading eyebrow="Poradnik" title={<>Jak dobrać <span className="accent-script">legowisko</span></>}>
              Dobrze dobrany rozmiar to połowa wygody. Trzy proste kroki, zanim klikniesz „Dodaj do koszyka”.
            </SectionHeading>
            <Link href="#kolekcja" onClick={() => setCategory(categories.some((c) => c.id === "legowiska") ? "legowiska" : "all")}
              className="btn-primary min-h-12 px-6 mt-8 inline-flex items-center gap-2 text-sm">
              Zobacz legowiska <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>
          <ol className="space-y-4">
            {sizingSteps.map(({ t, d }, i) => (
              <Reveal as="li" key={t} delay={i * 0.08} className="flex gap-5 sm:gap-7 rounded-[1.75rem] bg-card/80 border border-ink/10 p-6 sm:p-8">
                <span aria-hidden="true" className="w-9 sm:w-11 shrink-0 text-center font-display italic text-5xl sm:text-6xl leading-none text-cocoa/80 tabular-nums">{i + 1}</span>
                <div>
                  <h3 className="text-2xl text-ink">{t}</h3>
                  <p className="text-sm sm:text-base text-ink/80 leading-relaxed mt-2">{d}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-16">
          <Reveal>
            <SectionHeading eyebrow="FAQ" title={<>Masz <span className="accent-script">pytania?</span></>}>
              Najczęstsze pytania o rozmiary, dostawę i zwroty.
            </SectionHeading>
            <Link href="/kontakt" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-ink hover:text-cocoa transition-colors underline underline-offset-4 decoration-camel decoration-2">
              Nie ma tu odpowiedzi? Napisz do nas
            </Link>
          </Reveal>
          <Accordion className="divide-y divide-ink/10 border-y border-ink/10">
            {faqs.map(({ q, a }, i) => (
              <AccordionItem key={q} value={`${i}`} className="border-0">
                <AccordionTrigger className="font-display text-lg sm:text-xl text-ink py-5 text-left gap-4 hover:no-underline hover:text-cocoa">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-ink/80 text-sm sm:text-base leading-relaxed pb-5 pr-6">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-24">
        <Reveal>
          <div className="on-ink relative max-w-6xl mx-auto overflow-hidden rounded-[2.25rem] px-6 py-14 sm:px-14 sm:py-20 lg:grid lg:grid-cols-[1.3fr_1fr] lg:gap-12 lg:items-center">
            <div className="relative max-w-2xl">
              <p className="eyebrow mb-5">Petivo</p>
              <h2 className="text-[2rem] leading-[1.08] sm:text-5xl text-cream">
                Daj pupilowi miejsce, <span className="accent-script">które pokocha</span>
              </h2>
              <p className="text-cream/85 text-base sm:text-lg mt-5 max-w-md">
                Wybierz legowisko, akcesoria na spacer albo coś do zabawy. Darmowa dostawa w Polsce od {FREE_SHIPPING_FROM} zł.
              </p>
              <Link href="#kolekcja" className="btn-primary min-h-12 px-8 mt-9 inline-flex items-center justify-center gap-2 w-full min-[400px]:w-auto">
                Zobacz produkty <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            {ctaPhoto && (
              <div aria-hidden="true" className="relative hidden lg:block">
                <div className="absolute -right-10 -bottom-24 h-72 w-72 rounded-full bg-camel" />
                <div className="relative ml-auto w-[78%] aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[1.5rem] border-4 border-cream/15">
                  <Image src={ctaPhoto} alt="" fill sizes="30vw" className="object-cover" />
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </main>
    </MotionConfig>
  );
}
