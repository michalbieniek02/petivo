"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import { Reveal } from "@/components/scroll-reveal";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ProductGrid, type Filter } from "@/components/product-grid";
import { ProductStage } from "@/components/product-stage";
import { formatPrice, type Product } from "@/lib/products";
import { CATEGORIES, type CategoryId } from "@/lib/categories";
import { FREE_SHIPPING_FROM, SHIPPING_PL } from "@/lib/shop";
import { ArrowRight, Truck, RotateCcw, ShieldCheck, Lock, Ruler, Plus, Sparkles, MessageCircle, FileText } from "lucide-react";
import { BedQuiz } from "@/components/bed-quiz";
import { useCart } from "@/components/cart-provider";
import { PITCH, QUICK_ADD, SETS } from "@/lib/pitch";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

/** Hero scene: the donut in front, the cat house and the dog bed behind it. */
const HERO_CAT = "legowisko-domek-dla-kota";
const HERO_DOG = "legowisko-pianka-3d-zmywalna-poszewka";
const HERO_DONUT = "legowisko-donut-puszyste";
/** cream donut cut-out: reads well against the pink arch */
const HERO_DONUT_SHOT = "Sa62e3987ad4641a";

/** Two packshots per category tile (first one is the larger). */
const CATEGORY_PIECES: Record<CategoryId, string[]> = {
  legowiska: ["legowisko-donut-puszyste", "legowisko-domek-dla-kota"],
  spacer: ["szelki-ze-smycza-dla-malego-psa", "skladana-miska-podrozna"],
  zabawa: ["mata-wechowa-dla-psa", "drapak-tekturowy-dla-kota"],
  akcesoria: [],
};

const CATEGORY_STYLE: Record<CategoryId, { tile: string; blurb: string }> = {
  legowiska: { tile: "bg-accent-primary/15", blurb: "Puszyste donuty, płaskie z pianki i domki do chowania się" },
  spacer: { tile: "bg-accent-secondary/20", blurb: "Szelki ze smyczą, składana miska i ochrona kanapy w aucie" },
  zabawa: { tile: "bg-neutral-warm/40", blurb: "Maty węchowe, mata do lizania i drapak z tektury" },
  akcesoria: { tile: "bg-sand", blurb: "" },
};

/** Bed chooser: one row per bed type, facts taken from the product descriptions. */
const BED_TYPES = [
  { handle: "legowisko-donut-puszyste", who: "Śpi zwinięty w kłębek", facts: ["Podwyższony brzeg do oparcia głowy", "Średnica 40, 50, 60 lub 70 cm"] },
  { handle: "legowisko-pianka-3d-zmywalna-poszewka", who: "Lubi się wyciągnąć", facts: ["Zdejmowana, zmywalna poszewka", "Antypoślizgowy spód, rozmiary M–XXL"] },
  { handle: "legowisko-domek-dla-kota", who: "Szuka kryjówki", facts: ["Półzamknięta konstrukcja z wejściem", "Rozmiary M 33 cm i XL 39–40 cm"] },
];

/** "Why Petivo": only things the shop actually does. */
const reasons = [
  { icon: Sparkles, t: "Mały, przemyślany wybór", d: "Zamiast przewijać setki podobnych ofert, wybierasz spośród kilku produktów, które odpowiadają na codzienne potrzeby psa i kota." },
  { icon: Ruler, t: "Rozmiar bez zgadywania", d: "Wymiary w centymetrach, wagi od producenta i dobór legowiska w 30 sekund. Wiesz, co zamawiasz." },
  { icon: FileText, t: "Wszystko po polsku", d: "Opisy, zasady bezpieczeństwa i dane producenta przy każdym produkcie." },
  { icon: MessageCircle, t: "Pomożemy w wyborze", d: "Nie wiesz, który rozmiar? Napisz przez formularz kontaktowy, a doradzimy przed zakupem." },
];

const promises = [
  { icon: Truck,       title: `Darmowa dostawa od ${FREE_SHIPPING_FROM} zł`, desc: `W Polsce, poniżej tej kwoty ${SHIPPING_PL} zł` },
  { icon: RotateCcw,   title: "14 dni na zwrot",       desc: "Bez podawania przyczyny" },
  { icon: ShieldCheck, title: "2 lata na reklamację",  desc: "Zgodnie z prawem konsumenckim" },
  { icon: Lock,        title: "Bezpieczna płatność",   desc: "BLIK, karta, PayPal lub Klarna" },
];

const faqs = [
  { q: "Jak dobrać rozmiar legowiska?", a: "Zmierz pupila, gdy leży wyciągnięty i gdy śpi zwinięty, i wybierz rozmiar o kilka centymetrów większy. Przy każdym produkcie podajemy wymiary w centymetrach. Są przybliżone, bo ręczny pomiar może się różnić o 1–3 cm." },
  { q: "Ile trwa dostawa?", a: `Zamówienia wysyłamy od producentów — dostawa trwa zwykle 7–14 dni roboczych. W Polsce dostawa jest darmowa od ${FREE_SHIPPING_FROM} zł, poniżej ${SHIPPING_PL} zł.` },
  { q: "Czy mogę zwrócić produkt?", a: "Tak. Masz 14 dni na odstąpienie od umowy bez podania przyczyny, a reklamacje przyjmujemy przez 2 lata zgodnie z prawem konsumenckim. Wzór formularza odstąpienia znajdziesz na stronie „Formularz odstąpienia od umowy”." },
  { q: "Jak prać legowisko?", a: "Zalecamy delikatne pranie ręczne i suszenie na powietrzu. W legowisku z pianki 3D zdejmowaną poszewkę możesz wyprać osobno." },
  { q: "Kto jest producentem produktów?", a: "Petivo to nazwa sklepu. Przy każdym produkcie podajemy producenta, podmiot odpowiedzialny w Unii Europejskiej oraz ogólne ostrzeżenia bezpieczeństwa." },
  { q: "Jak mogę zapłacić?", a: "BLIK-iem, kartą płatniczą, przez Google Pay, PayPal lub Klarna (zapłać później). Płatność obsługuje Shopify, a dane karty nie trafiają do nas." },
  { q: "Kiedy dostanę numer przesyłki?", a: "Gdy paczka zostanie nadana, wyślemy Ci e-mail z numerem i linkiem do śledzenia. Zwykle dzieje się to w ciągu 1–3 dni roboczych od zamówienia." },
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

function plural(n: number, one: string, few: string, many: string) {
  if (n === 1) return `${n} ${one}`;
  const isFew = n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14);
  return `${n} ${isFew ? few : many}`;
}

/** Price tag pinned to a product in the hero scene. */
function SceneTag({ product, label, className, highlight = false }: { product: Product; label: string; className: string; highlight?: boolean }) {
  return (
    <Link href={`/produkt/${product.handle}`}
      className={`group absolute z-20 inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-card/95 backdrop-blur border pl-3.5 pr-1.5 py-1.5 shadow-[0_12px_30px_-16px_rgba(35,57,74,0.6)] hover:border-accent-primary transition-colors ${highlight ? "border-promo ring-2 ring-promo/35" : "border-neutral-warm/70"} ${className}`}>
      <span className="leading-tight">
        <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-accent-secondary-strong">{label}</span>
        <span className="block text-sm font-semibold text-ink">od {formatPrice(product.minPrice)}</span>
      </span>
      <span className="h-8 w-8 shrink-0 rounded-full bg-accent-primary-strong text-white flex items-center justify-center group-hover:bg-ink transition-colors">
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
    </Link>
  );
}

export function Landing({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<Filter>("all");
  const byHandle = (h: string) => products.find((p) => p.handle === h);

  const cat = byHandle(HERO_CAT), dog = byHandle(HERO_DOG), donut = byHandle(HERO_DONUT);
  const donutShot = donut?.gallery.find((g) => g.kind === "cutout" && g.src.includes(HERO_DONUT_SHOT))?.src ?? donut?.packshot;
  const scene = cat?.packshot && dog?.packshot && donut && donutShot ? { cat, dog, donut, donutShot } : null;

  const categories = CATEGORIES.map((c) => {
    const inCat = products.filter((p) => p.category === c.id);
    if (!inCat.length) return null;
    const pieces = CATEGORY_PIECES[c.id].map(byHandle).filter((p): p is Product => !!p?.packshot);
    return { ...c, count: inCat.length, from: Math.min(...inCat.map((p) => p.minPrice)), pieces, style: CATEGORY_STYLE[c.id] };
  }).filter((x) => x !== null);

  const { addItem } = useCart();
  const sets = SETS.map((set) => {
    const items = set.handles.map(byHandle).filter((p): p is Product => !!p?.packshot);
    return { ...set, items, total: items.reduce((sum, p) => sum + p.minPrice, 0) };
  }).filter((set) => set.items.length === set.handles.length && set.total >= FREE_SHIPPING_FROM);

  const beds = BED_TYPES.map((b) => ({ ...b, product: byHandle(b.handle) })).filter((b) => b.product?.packshot);

  const cheapest = products.length ? Math.min(...products.map((p) => p.minPrice)) : null;
  const ctaPiece = byHandle("legowisko-donut-puszyste")?.gallery.find((g) => g.kind === "cutout" && g.src.includes("S68613391656744c"))?.src
    ?? byHandle("legowisko-donut-puszyste")?.packshot ?? null;

  const pickCategory = (id: Filter) => {
    setCategory(id);
    document.getElementById("kolekcja")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <MotionConfig reducedMotion="user">
    <main id="main-content" className="min-h-dvh bg-background text-ink overflow-x-hidden">

      <SiteNav />

      {/* ─── HERO ─── */}
      <section className="grain relative overflow-hidden pt-24 pb-14 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 px-4 sm:px-6">
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <p className="eyebrow mb-5 sm:mb-6">Legowiska · spacer · zabawa</p>
            <h1 className="text-[2.6rem] leading-[1.02] min-[400px]:text-5xl sm:text-6xl lg:text-[4.4rem]">
              Miękko w domu<span className="font-sans font-normal">,</span>{" "}
              <span className="accent-script">dobrze na&nbsp;spacerze</span>
            </h1>
            <p className="text-base sm:text-lg text-ink/80 max-w-md mt-6 leading-relaxed">
              Zamiast setek przypadkowych ofert: kilka przemyślanych legowisk i akcesoriów dla psa i kota.
              Jasne rozmiary, opisy po polsku i pomoc w doborze, a do tego 14 dni na zwrot.
            </p>

            <div className="flex flex-col min-[400px]:flex-row gap-3 mt-8 sm:mt-10">
              <Link href="#kolekcja" className="btn-primary min-h-12 px-7 inline-flex items-center justify-center gap-2 text-base">
                Znajdź coś dla pupila <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="#jak-wybrac" className="btn-ghost min-h-12 px-6 inline-flex items-center justify-center text-sm">
                Dobierz legowisko w 30 s
              </Link>
            </div>

            {cheapest !== null && (
              <p className="mt-7 text-sm text-ink/75">
                {products.length} produktów od <strong className="font-semibold text-ink">{formatPrice(cheapest)}</strong>
                <span aria-hidden="true" className="mx-2 text-accent-primary">●</span>
                <span className="inline-block whitespace-nowrap rounded-full bg-promo px-2.5 py-0.5 font-semibold text-promo-ink">darmowa dostawa od {FREE_SHIPPING_FROM} zł</span>
              </p>
            )}
            <ul aria-label="Metody płatności" className="mt-4 flex flex-wrap gap-1.5">
              {["BLIK", "Karta", "Google Pay", "PayPal", "Klarna"].map((m) => (
                <li key={m} className="rounded-md border border-neutral-warm/80 bg-card px-2 py-0.5 text-[0.7rem] font-semibold tracking-wide text-ink/80">{m}</li>
              ))}
            </ul>
          </motion.div>

          {/* scene: the donut in front, the cat house and the dog bed behind it, on one floor */}
          {scene && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto w-full max-w-[34rem] lg:max-w-none aspect-[1/1] sm:aspect-[10/9]">
              {/* backdrop arch, sun and a small sage moon */}
              <div aria-hidden="true" className="absolute inset-x-[4%] top-[2%] bottom-[13%] rounded-t-[999px] rounded-b-[2.5rem]"
                style={{ background: "linear-gradient(180deg, #FCF1F0 0%, rgba(232,180,184,0.6) 100%)" }} />
              <div aria-hidden="true" className="absolute right-[13%] top-[8%] w-[17%] aspect-square rounded-full bg-neutral-warm" />
              <div aria-hidden="true" className="absolute left-[19%] top-[13%] w-[5.5%] aspect-square rounded-full bg-accent-primary/70" />
              {/* floor line and contact shadows */}
              <div aria-hidden="true" className="absolute left-[4%] right-[4%] bottom-[13%] h-px bg-ink/10" />
              <div aria-hidden="true" className="absolute left-[3%] bottom-[23%] w-[36%] h-[5%] rounded-[50%] bg-ink/25 blur-xl" />
              <div aria-hidden="true" className="absolute right-[2%] bottom-[23%] w-[38%] h-[5%] rounded-[50%] bg-ink/20 blur-xl" />
              <div aria-hidden="true" className="absolute left-[30%] bottom-[10%] w-[40%] h-[6%] rounded-[50%] bg-ink/30 blur-xl" />

              <Link href={`/produkt/${scene.cat.handle}`} aria-label={scene.cat.name}
                className="absolute left-[2%] bottom-[24%] w-[37%] aspect-[1.05] transition-transform duration-500 hover:-translate-y-1">
                <Image src={scene.cat.packshot!} alt={scene.cat.name} fill priority sizes="(max-width: 1024px) 40vw, 22vw"
                  className="object-contain object-bottom drop-shadow-[0_18px_22px_rgba(35,57,74,0.22)]" />
              </Link>
              <Link href={`/produkt/${scene.dog.handle}`} aria-label={scene.dog.name}
                className="absolute right-[1%] bottom-[24%] w-[39%] aspect-[1.55] transition-transform duration-500 hover:-translate-y-1">
                <Image src={scene.dog.packshot!} alt={scene.dog.name} fill priority sizes="(max-width: 1024px) 40vw, 22vw"
                  className="object-contain object-bottom drop-shadow-[0_18px_22px_rgba(35,57,74,0.22)]" />
              </Link>
              <Link href={`/produkt/${scene.donut.handle}`} aria-label={scene.donut.name}
                className="absolute left-1/2 -translate-x-1/2 bottom-[11%] z-10 w-[37%] aspect-[1.02] transition-transform duration-500 hover:-translate-y-1">
                <Image src={scene.donutShot} alt={scene.donut.name} fill priority sizes="(max-width: 1024px) 50vw, 28vw"
                  className="object-contain object-bottom drop-shadow-[0_22px_26px_rgba(35,57,74,0.28)]" />
              </Link>

              <SceneTag product={scene.cat} label="Dla kota" className="left-0 top-[27%]" />
              <SceneTag product={scene.dog} label="Dla psa" className="right-0 top-[37%]" />
              <SceneTag product={scene.donut} label="Puszysty donut" className="left-1/2 -translate-x-1/2 bottom-0" highlight />
            </motion.div>
          )}
        </div>
      </section>

      {/* ─── PROMISES ─── */}
      <section aria-label="Zakupy w Petivo" className="on-ink">
        <ul className="max-w-6xl mx-auto px-4 sm:px-6 py-7 sm:py-8 grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
          {promises.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex items-start gap-3">
              <Icon className="h-5 w-5 mt-0.5 shrink-0 text-neutral-warm" aria-hidden="true" />
              <span>
                <span className="block text-sm font-semibold text-background">{title}</span>
                <span className="block text-xs text-background/80 mt-0.5 leading-relaxed">{desc}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ─── CATEGORIES ─── */}
      {categories.length > 1 && (
        <section className="pt-16 sm:pt-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal className="mb-8 sm:mb-10">
              <SectionHeading eyebrow="Kategorie" title={<>Czego <span className="accent-script">szukasz?</span></>} />
            </Reveal>
            <ul className={`grid gap-4 sm:gap-5 ${categories.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
              {categories.map((c, i) => (
                <Reveal as="li" key={c.id} delay={i * 0.06}>
                  <button type="button" onClick={() => pickCategory(c.id)}
                    className={`group relative flex w-full flex-col text-left overflow-hidden rounded-[2rem] ${c.style.tile} aspect-[4/5] min-[480px]:aspect-[5/4] md:aspect-[4/5] p-6 sm:p-7`}>
                    <span className="relative z-10 block font-display text-[1.75rem] sm:text-3xl leading-tight text-ink">{c.label}</span>
                    {c.style.blurb && <span className="relative z-10 block text-sm text-ink/80 mt-1.5 max-w-[17rem]">{c.style.blurb}</span>}
                    <span className="relative flex-1 mt-3">
                      {c.pieces[0] && (
                        <span className="absolute left-0 bottom-0 h-full w-[60%] transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:-rotate-2">
                          <Image src={c.pieces[0].packshot!} alt="" fill sizes="(max-width: 768px) 55vw, 20vw" className="object-contain object-bottom drop-shadow-[0_14px_16px_rgba(35,57,74,0.2)]" />
                        </span>
                      )}
                      {c.pieces[1] && (
                        <span className="absolute right-0 bottom-0 h-[78%] w-[46%] transition-transform duration-500 delay-75 group-hover:-translate-y-1 group-hover:rotate-2">
                          <Image src={c.pieces[1].packshot!} alt="" fill sizes="(max-width: 768px) 45vw, 15vw" className="object-contain object-bottom drop-shadow-[0_14px_16px_rgba(35,57,74,0.2)]" />
                        </span>
                      )}
                    </span>
                    <span className="relative z-10 mt-2 flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-ink">{plural(c.count, "produkt", "produkty", "produktów")} · od {formatPrice(c.from)}</span>
                      <span className="h-11 w-11 shrink-0 rounded-full bg-ink text-background flex items-center justify-center group-hover:bg-accent-primary-strong transition-colors">
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </span>
                  </button>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ─── WHY PETIVO ─── */}
      <section aria-labelledby="why-petivo" className="pt-16 sm:pt-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-8 sm:mb-10">
            <div className="max-w-2xl">
              <p className="eyebrow mb-4">Dlaczego Petivo</p>
              <h2 id="why-petivo" className="text-[2rem] leading-[1.08] sm:text-5xl lg:text-[3.4rem]">Mniej szukania, <span className="accent-script">więcej pewności</span></h2>
            </div>
          </Reveal>
          <ul className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map(({ icon: Icon, t, d }, i) => (
              <Reveal as="li" key={t} delay={i * 0.05} className="rounded-[1.75rem] bg-card border border-neutral-warm/60 p-6">
                <span className="h-11 w-11 rounded-full bg-accent-primary/15 text-accent-primary-strong flex items-center justify-center">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-xl text-ink mt-4">{t}</h3>
                <p className="text-sm text-ink/80 mt-2 leading-relaxed">{d}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

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

      {/* ─── SETS ─── */}
      {sets.length > 0 && (
        <section aria-labelledby="sets-title" className="pb-16 sm:pb-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal className="mb-8 sm:mb-10">
              <div className="max-w-2xl">
                <p className="eyebrow mb-4">Zestawy</p>
                <h2 id="sets-title" className="text-[2rem] leading-[1.08] sm:text-5xl lg:text-[3.4rem]">Skompletuj <span className="accent-script">za jednym razem</span></h2>
                <p className="text-ink/80 text-base sm:text-lg leading-relaxed mt-4">Każdy zestaw przekracza {FREE_SHIPPING_FROM} zł, więc dostawę masz gratis.</p>
              </div>
            </Reveal>
            <ul className="grid gap-4 sm:gap-5 lg:grid-cols-3">
              {sets.map((set, i) => (
                <Reveal as="li" key={set.title} delay={i * 0.06} className="flex flex-col rounded-[2rem] bg-card border border-neutral-warm/60 p-5 sm:p-6">
                  <div className="grid grid-cols-3 gap-2">
                    {set.items.map((p) => (
                      <ProductStage key={p.handle} src={p.packshot!} alt="" className="aspect-square" radius="rounded-2xl" sizes="(max-width: 1024px) 30vw, 10vw" padding="p-[10%]" />
                    ))}
                  </div>
                  <h3 className="text-2xl text-ink mt-5">{set.title}</h3>
                  <p className="text-sm text-ink/80 mt-1.5">{set.desc}</p>
                  <ul className="mt-4 divide-y divide-neutral-warm/50 border-y border-neutral-warm/50">
                    {set.items.map((p) => {
                      const cheapest = [...p.variants].sort((a, b) => a.price - b.price)[0];
                      const quick = QUICK_ADD.includes(p.handle) || p.variants.length === 1;
                      return (
                        <li key={p.handle} className="flex items-center justify-between gap-3 py-2.5">
                          <Link href={`/produkt/${p.handle}`} className="min-w-0 text-sm text-ink hover:text-accent-primary-strong">
                            <span className="block truncate font-medium">{PITCH[p.handle]?.short ?? p.name}</span>
                            <span className="block text-xs text-ink/75 tabular-nums">od {formatPrice(p.minPrice)}</span>
                          </Link>
                          {quick ? (
                            <button type="button" aria-label={`Dodaj do koszyka: ${p.name}`}
                              onClick={() => addItem({ variantId: cheapest.id, handle: p.handle, name: p.name, variantTitle: p.optionName ? cheapest.title : null, price: cheapest.price, image: p.packshot ?? p.images[0] })}
                              className="min-h-10 shrink-0 rounded-full bg-accent-primary-strong px-3.5 text-xs font-semibold text-white hover:bg-ink transition-colors inline-flex items-center gap-1">
                              <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Dodaj
                            </button>
                          ) : (
                            <Link href={`/produkt/${p.handle}`} className="min-h-10 shrink-0 rounded-full border border-ink/25 px-3.5 text-xs font-semibold text-ink hover:border-ink inline-flex items-center gap-1">
                              Wybierz rozmiar <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-auto pt-4 flex items-end justify-between gap-3">
                    <span className="inline-block rounded-full bg-promo px-2.5 py-0.5 text-xs font-semibold text-promo-ink">darmowa dostawa</span>
                    <span className="text-right">
                      <span className="block text-xs text-ink/75">Razem od</span>
                      <span className="font-display text-3xl text-ink tabular-nums">{formatPrice(set.total)}</span>
                    </span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ─── BED CHOOSER + SIZING ─── */}
      <section id="jak-wybrac" className="on-sand grain bg-sand py-16 sm:py-24 px-4 sm:px-6 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-10 sm:mb-12">
            <SectionHeading eyebrow="Poradnik" title={<>Nie wiesz, <span className="accent-script">co wybrać?</span></>}>
              Odpowiedz na trzy pytania, a podpowiemy legowisko i rozmiar. Albo porównaj trzy typy poniżej.
            </SectionHeading>
          </Reveal>

          <Reveal className="mb-6 sm:mb-8">
            <BedQuiz products={products} />
          </Reveal>

          {beds.length > 0 && (
            <ol className="grid gap-4 sm:gap-5 md:grid-cols-3">
              {beds.map((b, i) => (
                <Reveal as="li" key={b.handle} delay={i * 0.06} className="h-full">
                  <Link href={`/produkt/${b.handle}`} className="group flex h-full flex-col rounded-[2rem] bg-card border border-neutral-warm/60 p-3 hover:shadow-[0_28px_56px_-34px_rgba(35,57,74,0.55)] transition-shadow">
                    <ProductStage src={b.product!.packshot!} alt={b.product!.name} className="aspect-[4/3]" sizes="(max-width: 768px) 100vw, 33vw" padding="p-[10%]" />
                    <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-primary-strong">{b.who}</p>
                      <h3 className="text-2xl text-ink mt-2 leading-tight">{b.product!.name}</h3>
                      <ul className="mt-3 space-y-1.5 text-sm text-ink/80">
                        {b.facts.map((f) => (
                          <li key={f} className="flex gap-2"><span aria-hidden="true" className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-secondary" />{f}</li>
                        ))}
                      </ul>
                      <span className="mt-auto pt-5 flex items-center justify-between">
                        <span className="font-display text-2xl text-ink tabular-nums"><span className="font-sans text-xs font-semibold text-ink/75 mr-1">od</span>{formatPrice(b.product!.minPrice)}</span>
                        <span className="h-11 w-11 rounded-full bg-accent-primary/15 text-accent-primary-strong flex items-center justify-center group-hover:bg-accent-primary-strong group-hover:text-white transition-colors">
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </ol>
          )}

          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 mt-4 sm:mt-5">
            {[
              { icon: Ruler, t: "Zmierz pupila", d: "Długość od nosa do nasady ogona, gdy leży wyciągnięty, i średnicę, gdy śpi zwinięty w kłębek." },
              { icon: Plus, t: "Dodaj kilka centymetrów", d: "Wybierz rozmiar z zapasem. Wymiary w opisach są przybliżone (1–3 cm różnicy), a w razie wątpliwości napisz do nas." },
            ].map(({ icon: Icon, t, d }, i) => (
              <Reveal key={t} delay={0.1 + i * 0.06} className="flex gap-4 rounded-[1.75rem] bg-card/70 border border-neutral-warm/60 p-6">
                <span className="h-11 w-11 shrink-0 rounded-full bg-ink text-background flex items-center justify-center">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-xl text-ink">{t}</h3>
                  <p className="text-sm sm:text-base text-ink/80 leading-relaxed mt-1">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-16 border-t border-neutral-warm/55">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-16">
          <Reveal>
            <SectionHeading eyebrow="FAQ" title={<>Masz <span className="accent-script">pytania?</span></>}>
              Najczęstsze pytania o rozmiary, dostawę i zwroty.
            </SectionHeading>
            <Link href="/kontakt" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-ink hover:text-accent-primary-strong transition-colors underline underline-offset-4 decoration-accent-primary decoration-2">
              Nie ma tu odpowiedzi? Napisz do nas
            </Link>
          </Reveal>
          <Accordion className="divide-y divide-neutral-warm/55 border-y border-neutral-warm/55">
            {faqs.map(({ q, a }, i) => (
              <AccordionItem key={q} value={`${i}`} className="border-0">
                <AccordionTrigger className="font-display text-lg sm:text-xl text-ink py-5 text-left gap-4 hover:no-underline hover:text-accent-primary-strong">
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
              <h2 className="text-[2rem] leading-[1.08] sm:text-5xl text-background">
                Daj pupilowi miejsce, <span className="accent-script">które pokocha</span>
              </h2>
              <p className="text-background/85 text-base sm:text-lg mt-5 max-w-md">
                Wybierz legowisko, akcesoria na spacer albo coś do zabawy. Darmowa dostawa w Polsce od {FREE_SHIPPING_FROM} zł.
              </p>
              <Link href="#kolekcja" className="btn-primary min-h-12 px-8 mt-9 inline-flex items-center justify-center gap-2 w-full min-[400px]:w-auto">
                Zobacz produkty <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            {ctaPiece && (
              <div aria-hidden="true" className="relative hidden lg:block h-full min-h-[18rem]">
                <div className="absolute right-[4%] top-1/2 -translate-y-1/2 w-[86%] aspect-square rounded-full bg-accent-primary" />
                <div className="absolute right-[10%] top-1/2 -translate-y-[46%] w-[74%] aspect-square">
                  <Image src={ctaPiece} alt="" fill sizes="30vw" className="object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.35)]" />
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
