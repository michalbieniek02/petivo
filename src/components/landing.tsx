"use client";
import Image from "next/image";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { Reveal } from "@/components/scroll-reveal";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ProductGrid } from "@/components/product-grid";
import { formatPrice, type Product } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import { FREE_SHIPPING_FROM, SHIPPING_PL } from "@/lib/shop";
import { ArrowRight, Truck, RotateCcw, ShieldCheck, Lock, Ruler, Layers, MessageCircle } from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

/** Products shown in the hero collage, in this order (first with a photo wins). */
const HERO_HANDLES = [
  "legowisko-pianka-3d-zmywalna-poszewka",
  "legowisko-domek-dla-kota",
  "pokrowiec-samochodowy-dla-psa",
];

const promises = [
  { icon: Truck,       title: `Darmowa dostawa od ${FREE_SHIPPING_FROM} zł`, desc: `W Polsce, poniżej tej kwoty ${SHIPPING_PL} zł` },
  { icon: RotateCcw,   title: "14 dni na zwrot",          desc: "Odstąpienie od umowy bez podania przyczyny" },
  { icon: ShieldCheck, title: "2 lata na reklamację",     desc: "Zgodnie z prawem konsumenckim" },
  { icon: Lock,        title: "Bezpieczna płatność",      desc: "Karta lub PayPal, obsługuje Shopify" },
];

const sizingSteps = [
  { icon: Ruler,         t: "Zmierz pupila",           d: "Zmierz długość od nosa do nasady ogona, gdy pupil leży wyciągnięty, oraz jego średnicę, gdy śpi zwinięty w kłębek." },
  { icon: Layers,        t: "Wybierz rodzaj legowiska", d: "Okrągłe, puszyste legowisko dla zwijających się w kłębek, płaskie z pianki dla wyciągniętych, domek dla kotów lubiących kryjówki." },
  { icon: MessageCircle, t: "Nie jesteś pewien?",       d: "Dobierz rozmiar o kilka centymetrów większy. Wymiary w opisach są podane w przybliżeniu (różnica 1–3 cm), a w razie pytań napisz do nas." },
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
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.08]">{title}</h2>
      {children && <p className="text-white/65 text-base sm:text-lg leading-relaxed mt-4">{children}</p>}
    </div>
  );
}

export function Landing({ products }: { products: Product[] }) {
  // Hero collage: the first scene photo of up to three chosen products (fall back to any product with a photo).
  const photoOf = (p: Product) => p.gallery.find((g) => g.kind === "photo");
  const chosen = HERO_HANDLES.map((h) => products.find((p) => p.handle === h)).filter((p): p is Product => !!p && !!photoOf(p));
  const fallback = products.filter((p) => !chosen.includes(p) && photoOf(p));
  const hero = [...chosen, ...fallback].slice(0, 3);

  // "Legowiska od 109 zł · Spacer i podróż od 29 zł" — computed from live Shopify prices.
  const fromPrices = CATEGORIES.map((c) => {
    const inCat = products.filter((p) => p.category === c.id);
    return inCat.length ? { label: c.label, price: Math.min(...inCat.map((p) => p.minPrice)) } : null;
  }).filter((x) => x !== null);

  return (
    <MotionConfig reducedMotion="user">
    <main id="main-content" className="min-h-dvh bg-[#06060e] text-white overflow-x-hidden">

      <SiteNav />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 px-4 sm:px-6">
        <div aria-hidden="true" className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[700px] pointer-events-none"
          style={{ background: "radial-gradient(closest-side, rgba(139,92,246,0.16), transparent)" }} />

        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <p className="eyebrow mb-4 sm:mb-5">Legowiska, maty i akcesoria dla psa i kota</p>
            <h1 className="text-[2.35rem] leading-[1.04] min-[400px]:text-5xl sm:text-6xl lg:text-[4.25rem] font-extrabold">
              Miękko w domu<span className="font-sans">,</span>{" "}
              <span className="text-gradient">wygodnie na spacerze</span>
            </h1>
            <p className="text-base sm:text-lg text-white/70 max-w-lg mt-5 sm:mt-6 leading-relaxed">
              Puszyste legowiska, maty do zabawy i akcesoria na spacery i w podróż. Opisy po polsku,
              dane producenta przy każdym produkcie i darmowa dostawa od {FREE_SHIPPING_FROM} zł.
            </p>

            <div className="flex flex-col min-[400px]:flex-row gap-3 mt-7 sm:mt-9">
              <Link href="#kolekcja" className="btn-primary min-h-12 px-7 inline-flex items-center justify-center gap-2 text-base">
                Zobacz produkty <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="#jak-wybrac" className="btn-ghost min-h-12 px-6 inline-flex items-center justify-center text-sm">
                Jak dobrać rozmiar
              </Link>
            </div>

            {fromPrices.length > 0 && (
              <p className="mt-6 text-sm text-white/65">
                {fromPrices.map((c, i) => (
                  <span key={c.label}>
                    {i > 0 && <span aria-hidden="true" className="mx-2 text-white/30">·</span>}
                    {c.label} od <strong className="font-semibold text-white">{formatPrice(c.price)}</strong>
                  </span>
                ))}
              </p>
            )}
          </motion.div>

          {/* real product photos, each linking to its product */}
          {hero.length >= 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4 aspect-[5/4] sm:aspect-[4/3] lg:aspect-square">
              {hero.map((p, i) => {
                const photo = photoOf(p)!;
                return (
                  <Link key={p.handle} href={`/produkt/${p.handle}`}
                    className={`group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[var(--panel)] ${i === 0 ? "row-span-2" : ""}`}>
                    <Image src={photo.src} alt={p.name} fill priority={i === 0} sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4 pt-10">
                      <span className="block text-xs sm:text-sm font-semibold text-white leading-tight">{p.name}</span>
                      <span className="block text-xs text-white/70 tabular-nums mt-0.5">od {formatPrice(p.minPrice)}</span>
                    </span>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* ─── PROMISES ─── */}
      <section aria-label="Zakupy w Petivo" className="border-y border-white/[0.06] bg-white/[0.015]">
        <ul className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
          {promises.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex items-start gap-3">
              <span className="mt-0.5 h-9 w-9 shrink-0 rounded-xl flex items-center justify-center bg-cyan-400/[0.08] border border-cyan-300/15">
                <Icon className="h-4 w-4 text-cyan-200" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-white">{title}</span>
                <span className="block text-xs text-white/60 mt-0.5 leading-relaxed">{desc}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ─── COLLECTION ─── */}
      <section id="kolekcja" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-8 sm:mb-10">
            <SectionHeading eyebrow="Sklep" title="Wybierz coś dla swojego pupila">
              Legowiska dla psów i kotów, szelki ze smyczą, pokrowiec do samochodu oraz maty i drapak na zajęcie pupila.
            </SectionHeading>
          </Reveal>
          <ProductGrid products={products} />
        </div>
      </section>

      {/* ─── SIZING GUIDE ─── */}
      <section id="jak-wybrac" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-16 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-10 sm:mb-14">
            <SectionHeading eyebrow="Poradnik" title="Jak dobrać legowisko">
              Dobrze dobrany rozmiar to połowa wygody. Kilka prostych kroków.
            </SectionHeading>
          </Reveal>
          <ol className="grid md:grid-cols-3 gap-4">
            {sizingSteps.map(({ icon: Icon, t, d }, i) => (
              <Reveal as="li" key={t} delay={i * 0.08} className="surface rounded-3xl p-6 sm:p-7 h-full">
                <span className="h-10 w-10 rounded-xl flex items-center justify-center bg-purple-400/10 border border-purple-300/15">
                  <Icon className="h-5 w-5 text-purple-200" aria-hidden="true" />
                </span>
                <h3 className="text-xl font-bold text-white mt-4">{t}</h3>
                <p className="text-sm text-white/65 leading-relaxed mt-2">{d}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-16 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-16">
          <Reveal>
            <SectionHeading eyebrow="FAQ" title="Masz pytania?">
              Najczęstsze pytania o rozmiary, dostawę i zwroty.
            </SectionHeading>
            <Link href="/kontakt" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-white hover:text-cyan-200 transition-colors underline underline-offset-4 decoration-white/30">
              Nie ma tu odpowiedzi? Napisz do nas
            </Link>
          </Reveal>
          <Accordion className="space-y-2">
            {faqs.map(({ q, a }, i) => (
              <AccordionItem key={q} value={`${i}`}
                className="surface rounded-2xl px-4 sm:px-6 hover:border-white/[0.16] transition-colors data-[state=open]:border-purple-400/40">
                <AccordionTrigger className="text-white font-semibold text-[0.95rem] py-4 sm:py-5 text-left gap-4 hover:no-underline">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-white/70 text-sm leading-relaxed pb-5">
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
          <div className="relative max-w-6xl mx-auto overflow-hidden rounded-[2rem] border border-white/[0.08] px-6 py-12 sm:px-12 sm:py-16 text-center"
            style={{ background: "radial-gradient(90% 120% at 50% 100%, rgba(139,92,246,0.22), rgba(34,211,238,0.06) 50%, rgba(255,255,255,0.02) 80%)" }}>
            <h2 className="text-3xl min-[400px]:text-4xl sm:text-5xl font-extrabold leading-[1.08] max-w-2xl mx-auto">
              Daj pupilowi <span className="text-gradient">miejsce, które pokocha</span>
            </h2>
            <p className="text-white/70 text-base sm:text-lg mt-5 max-w-md mx-auto">
              Wybierz legowisko, akcesoria na spacer lub zabawę. Darmowa dostawa w Polsce od {FREE_SHIPPING_FROM} zł.
            </p>
            <Link href="#kolekcja" className="btn-primary min-h-12 px-8 mt-8 inline-flex items-center justify-center gap-2 w-full min-[400px]:w-auto">
              Zobacz produkty <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </main>
    </MotionConfig>
  );
}
