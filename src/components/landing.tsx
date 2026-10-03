"use client";
import Image from "next/image";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { Reveal } from "@/components/scroll-reveal";
import { AddToCartBtn } from "@/components/add-to-cart-btn";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ProductGrid } from "@/components/product-grid";
import { ProductStage } from "@/components/product-stage";
import { formatPrice, type Product } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import { FREE_SHIPPING_FROM, SHIPPING_PL } from "@/lib/shop";
import {
  Wifi, Smartphone, Clock, Shield, Camera, Settings2, ArrowRight,
  Truck, RotateCcw, ShieldCheck, Lock, BriefcaseBusiness, Car, Plane,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const FLAGSHIP = "automatyczny-karmnik-z-kamera-hd-wifi";

const features = [
  { icon: Wifi,       title: "WiFi i zdalne sterowanie", desc: "Zmieniaj harmonogram i podawaj dodatkową porcję z telefonu, gdziekolwiek jesteś." },
  { icon: Smartphone, title: "Aplikacja iOS i Android",  desc: "Harmonogram, porcje i podgląd karmienia w darmowej aplikacji." },
  { icon: Camera,     title: "Kamera HD",                desc: "Podgląd na żywo — sprawdzisz, czy pupil zjadł posiłek." },
  { icon: Clock,      title: "Stałe pory posiłków",      desc: "Karmnik sam wydaje posiłek o ustawionych godzinach, także bez internetu." },
  { icon: Settings2,  title: "Ustalone porcje",          desc: "Wybierasz liczbę porcji na posiłek — pomocne przy diecie pupila." },
  { icon: Shield,     title: "Szczelny zbiornik 2 L",    desc: "Chroni suchą karmę przed wilgocią i utratą świeżości." },
];

const promises = [
  { icon: Truck,       title: `Darmowa dostawa od ${FREE_SHIPPING_FROM} zł`, desc: `W Polsce, poniżej tej kwoty ${SHIPPING_PL} zł` },
  { icon: RotateCcw,   title: "14 dni na zwrot",          desc: "Odstąpienie od umowy bez podania przyczyny" },
  { icon: ShieldCheck, title: "2 lata na reklamację",     desc: "Zgodnie z prawem konsumenckim" },
  { icon: Lock,        title: "Bezpieczna płatność",      desc: "Karta lub PayPal, obsługuje Shopify" },
];

const steps = [
  { n: "1", t: "Podłącz i skonfiguruj", d: "Ustaw karmnik, podłącz do prądu i połącz z aplikacją przez WiFi." },
  { n: "2", t: "Ustaw harmonogram",     d: "Wybierz godziny i wielkość porcji. Aplikacja zapamiętuje wszystko automatycznie." },
  { n: "3", t: "Ciesz się spokojem",    d: "Wyjedź, idź do pracy, zrób zakupy. Karmnik zajmie się resztą." },
];

const faqs = [
  { q: "Czy działa bez internetu?",          a: "Tak. Harmonogram zapisany w urządzeniu działa bez internetu. WiFi jest potrzebne do podglądu z kamery i zmian w aplikacji." },
  { q: "Jaki rodzaj karmy mogę używać?",     a: "Wyłącznie suchą karmę (granulki). Karmnik nie nadaje się do karmy mokrej." },
  { q: "Ile karmy mieści zbiornik?",         a: "Zbiornik ma pojemność 2 litrów. Na ile dni wystarczy, zależy od wielkości pupila i porcji." },
  { q: "Czy zasilacz jest w zestawie?",      a: "Nie — zasilacz sieciowy nie jest dołączony. Wystarczy zwykła ładowarka USB 5V 2A, np. od telefonu." },
  { q: "Ile trwa dostawa?",                  a: `Zamówienia wysyłamy od producenta — dostawa trwa zwykle 5–10 dni roboczych. W Polsce dostawa jest darmowa od ${FREE_SHIPPING_FROM} zł, poniżej ${SHIPPING_PL} zł.` },
  { q: "Czy mogę zwrócić produkt?",          a: "Tak. Masz 14 dni na odstąpienie od umowy bez podania przyczyny, a reklamacje przyjmujemy przez 2 lata zgodnie z prawem konsumenckim." },
];

const worries = [
  { icon: BriefcaseBusiness, t: "Stres w pracy",     d: "Myślisz o pupilu zamiast skupić się na pracy." },
  { icon: Car,               t: "Korek w drodze",    d: "Wracasz za późno, a pora karmienia już minęła." },
  { icon: Plane,             t: "Wyjazd na weekend", d: "Prosisz bliskich o pomoc przy każdym wyjeździe." },
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
  const flagship = products.find((p) => p.handle === FLAGSHIP);
  const fountain = products.find((p) => p.category === "fontanny");
  const heroBack = products.find((p) => p.cutout && p.handle !== FLAGSHIP && p.category === "karmniki");

  // "Karmniki od 299 zł · Fontanny od 199 zł" — computed from live Shopify prices.
  const fromPrices = CATEGORIES.map((c) => {
    const inCat = products.filter((p) => p.category === c.id);
    return inCat.length ? { label: c.label, price: Math.min(...inCat.map((p) => p.minPrice)) } : null;
  }).filter((x) => x !== null);

  const flagshipItem = flagship && {
    variantId: flagship.variants[0].id,
    handle: flagship.handle,
    name: flagship.name,
    variantTitle: null,
    price: flagship.variants[0].price,
    image: flagship.cutout ?? flagship.images[0],
  };

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
            <p className="eyebrow mb-4 sm:mb-5">Karmniki i fontanny dla kota i psa</p>
            <h1 className="text-[2.35rem] leading-[1.04] min-[400px]:text-5xl sm:text-6xl lg:text-[4.25rem] font-extrabold">
              Pełna miska i świeża woda,{" "}
              <span className="text-gradient">nawet gdy Cię nie ma</span>
            </h1>
            <p className="text-base sm:text-lg text-white/70 max-w-lg mt-5 sm:mt-6 leading-relaxed">
              Automatyczne karmniki z aplikacją i kamerą oraz fontanna ze stali nierdzewnej.
              Ustawiasz harmonogram raz, a posiłki są wydawane o stałych porach.
            </p>

            <div className="flex flex-col min-[400px]:flex-row gap-3 mt-7 sm:mt-9">
              <Link href="#kolekcja" className="btn-primary min-h-12 px-7 inline-flex items-center justify-center gap-2 text-base">
                Zobacz produkty <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="#jak-dziala" className="btn-ghost min-h-12 px-6 inline-flex items-center justify-center text-sm">
                Jak to działa
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

          {/* product composition: the real lineup, no invented badges */}
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative">
            <div className="relative aspect-[5/4] sm:aspect-[4/3] lg:aspect-square rounded-[2rem] overflow-hidden border border-white/[0.07]"
              style={{ background: "radial-gradient(110% 85% at 50% 10%, rgba(139,92,246,0.24) 0%, rgba(34,211,238,0.08) 45%, rgba(255,255,255,0.015) 75%)" }}>
              <div aria-hidden="true" className="absolute left-1/2 bottom-[9%] -translate-x-1/2 w-3/4 h-[9%] rounded-[50%] bg-black/70 blur-2xl" />
              {heroBack?.cutout && (
                <div className="absolute left-[4%] bottom-[12%] w-[34%] h-[52%] opacity-90">
                  <Image src={heroBack.cutout} alt={heroBack.name} fill sizes="(max-width: 1024px) 35vw, 18vw"
                    className="object-contain object-bottom drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]" />
                </div>
              )}
              {flagship?.cutout && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-[10%] w-[52%] h-[78%]">
                  <Image src={flagship.cutout} alt={flagship.name} fill priority sizes="(max-width: 1024px) 55vw, 28vw"
                    className="object-contain object-bottom drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]" />
                </div>
              )}
              {fountain?.cutout && (
                <div className="absolute right-[4%] bottom-[11%] w-[30%] h-[40%]">
                  <Image src={fountain.cutout} alt={fountain.name} fill sizes="(max-width: 1024px) 30vw, 15vw"
                    className="object-contain object-bottom drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]" />
                </div>
              )}
            </div>
            {flagship && (
              <Link href={`/produkt/${flagship.handle}`}
                className="group absolute left-3 top-3 sm:left-4 sm:top-4 rounded-2xl border border-white/10 bg-[#06060e]/75 backdrop-blur px-3.5 py-2.5 hover:border-white/25 transition-colors">
                <span className="block text-xs text-white/65">{flagship.name}</span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-white tabular-nums">
                  {formatPrice(flagship.minPrice)}
                  <ArrowRight className="h-3.5 w-3.5 text-white/60 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </span>
              </Link>
            )}
          </motion.div>
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
            <SectionHeading eyebrow="Sklep" title="Wybierz sprzęt dla swojego pupila">
              Karmniki z aplikacją i kamerą, karmnik dla dwóch pupili i fontanna ze świeżą wodą.
            </SectionHeading>
          </Reveal>
          <ProductGrid products={products} />
        </div>
      </section>

      {/* ─── WHY ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">
          <Reveal>
            <SectionHeading eyebrow="Dla zabieganych" title={<>Korek, nadgodziny, <span className="text-white/55">a miska pusta</span></>}>
              Życie jest nieprzewidywalne. Twój pies albo kot nie rozumie, dlaczego miska jest pusta o 18:00.
              Automatyczny karmnik wydaje posiłek o ustalonej porze, niezależnie od Twojego grafiku.
            </SectionHeading>
          </Reveal>
          <ul className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {worries.map(({ icon: Icon, t, d }, i) => (
              <Reveal as="li" key={t} delay={i * 0.06} className="flex items-start gap-4 py-5">
                  <span className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center bg-purple-400/10 border border-purple-300/15">
                    <Icon className="h-5 w-5 text-purple-200" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-semibold text-white">{t}</span>
                    <span className="block text-sm text-white/65 mt-1 leading-relaxed">{d}</span>
                  </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── FLAGSHIP ─── */}
      {flagship && flagshipItem && (
        <section id="funkcje" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-16 border-t border-white/[0.05]">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal>
              <ProductStage src={flagship.cutout ?? flagship.images[0]} alt={flagship.name} padding="p-[13%]"
                className="aspect-square border border-white/[0.07]" sizes="(max-width: 1024px) 100vw, 50vw" />
            </Reveal>
            <div>
              <Reveal>
                <SectionHeading eyebrow={flagship.name} title="Widzisz, że pupil zjadł — z dowolnego miejsca">
                  Zaprogramuj harmonogram, dobierz porcje i zajrzyj do miski przez kamerę w aplikacji.
                </SectionHeading>
              </Reveal>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-5 mt-8">
                {features.map(({ icon: Icon, title, desc }, i) => (
                  <Reveal as="li" key={title} delay={i * 0.04} className="flex items-start gap-3">
                      <Icon className="h-5 w-5 mt-0.5 shrink-0 text-purple-300" aria-hidden="true" />
                      <span>
                        <span className="block text-sm font-semibold text-white">{title}</span>
                        <span className="block text-sm text-white/65 mt-1 leading-relaxed">{desc}</span>
                      </span>
                  </Reveal>
                ))}
              </ul>
              <Reveal>
                <div className="mt-9 surface rounded-2xl p-4 sm:p-5 flex flex-col min-[480px]:flex-row min-[480px]:items-center gap-4">
                  <div className="min-[480px]:mr-auto">
                    <div className="font-display text-3xl font-bold tabular-nums">{formatPrice(flagship.minPrice)}</div>
                    <div className="text-xs text-white/60 mt-1">
                      {flagship.minPrice >= FREE_SHIPPING_FROM ? "Darmowa dostawa w Polsce" : `Dostawa w Polsce ${SHIPPING_PL} zł`}
                    </div>
                  </div>
                  <Link href={`/produkt/${flagship.handle}`} className="btn-ghost min-h-11 px-5 inline-flex items-center justify-center text-sm">
                    Szczegóły
                  </Link>
                  <AddToCartBtn item={flagshipItem} className="min-h-11 px-6 text-sm justify-center">
                    Dodaj do koszyka
                  </AddToCartBtn>
                </div>
                <p className="text-xs text-white/55 mt-3">Zasilacz nie jest w zestawie — wystarczy ładowarka USB 5V 2A.</p>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* ─── HOW IT WORKS ─── */}
      <section id="jak-dziala" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-16 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-10 sm:mb-14">
            <SectionHeading eyebrow="Jak to działa" title="Gotowe w kilka minut" />
          </Reveal>
          <ol className="grid md:grid-cols-3 gap-4">
            {steps.map(({ n, t, d }, i) => (
              <Reveal as="li" key={n} delay={i * 0.08} className="surface rounded-3xl p-6 sm:p-7 h-full">
                  <span className="font-display text-sm font-bold text-cyan-200 tabular-nums">Krok {n}</span>
                  <h3 className="text-xl font-bold text-white mt-3">{t}</h3>
                  <p className="text-sm text-white/65 leading-relaxed mt-2">{d}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── FOUNTAIN ─── */}
      {fountain && (
        <section id="fontanna" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-16 border-t border-white/[0.05]">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="lg:order-2">
              <Reveal>
                <ProductStage src={fountain.cutout ?? fountain.images[0]} alt={fountain.name} padding="p-[16%]"
                  className="aspect-[4/3] lg:aspect-square border border-white/[0.07]" sizes="(max-width: 1024px) 100vw, 50vw" />
              </Reveal>
            </div>
            <div className="lg:order-1">
              <Reveal>
                <SectionHeading eyebrow="Fontanna" title="Świeża woda w misce ze stali">
                  {fountain.name} — {fountain.tagline.charAt(0).toLowerCase() + fountain.tagline.slice(1)}.
                </SectionHeading>
              </Reveal>
              {fountain.variants.length > 1 && (
                <Reveal>
                  <p className="text-xs font-semibold tracking-[0.16em] uppercase text-white/60 mt-8 mb-3">Dostępne wersje</p>
                  <ul className="space-y-2">
                    {fountain.variants.map((v) => (
                      <li key={v.id} className="flex items-center justify-between gap-4 surface rounded-xl px-4 py-3 text-sm">
                        <span className="text-white/80">{v.title}</span>
                        <span className="font-semibold text-white tabular-nums">{formatPrice(v.price)}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
              <Reveal>
                <Link href={`/produkt/${fountain.handle}`} className="btn-primary min-h-12 px-7 mt-8 inline-flex items-center justify-center gap-2 w-full min-[480px]:w-auto">
                  Zobacz fontannę <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-16 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-16">
          <Reveal>
            <SectionHeading eyebrow="FAQ" title="Masz pytania?">
              Najczęstsze pytania o karmniki, dostawę i zwroty.
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
              Ustaw raz, <span className="text-gradient">a miska będzie pełna o czasie</span>
            </h2>
            <p className="text-white/70 text-base sm:text-lg mt-5 max-w-md mx-auto">
              Wybierz karmnik albo fontannę. Darmowa dostawa w Polsce od {FREE_SHIPPING_FROM} zł.
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
