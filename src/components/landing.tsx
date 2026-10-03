"use client";
import Image from "next/image";
import { MotionConfig, motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/scroll-reveal";
import { AddToCartBtn as BaseAddToCartBtn } from "@/components/add-to-cart-btn";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ProductGrid } from "@/components/product-grid";
import type { Product } from "@/lib/products";
import type { ComponentProps } from "react";
import {
  Wifi, Smartphone, Clock, Shield, Check,
  Zap, Settings2, ChevronDown, Camera, BriefcaseBusiness, Car, Plane, PawPrint,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const IMG = "/products/karmnik-kamera-hd.webp";

const AUTO_ITEM = {
  variantId: 58834277204342,
  handle: "automatyczny-karmnik-z-kamera-hd-wifi",
  name: "Automatyczny karmnik z kamerą HD",
  variantTitle: null,
  price: 399,
  image: IMG,
};

function AddToCartBtn(props: Omit<ComponentProps<typeof BaseAddToCartBtn>, "item">) {
  return <BaseAddToCartBtn item={AUTO_ITEM} {...props} />;
}

const features = [
  { icon: Wifi,       title: "WiFi i zdalne sterowanie", desc: "Zmieniaj harmonogram i podawaj dodatkową porcję z telefonu, gdziekolwiek jesteś." },
  { icon: Smartphone, title: "Aplikacja iOS i Android",  desc: "Harmonogram, porcje i podgląd karmienia w darmowej aplikacji." },
  { icon: Camera,     title: "Kamera HD",                desc: "Podgląd na żywo — sprawdzisz, czy pupil zjadł posiłek." },
  { icon: Clock,      title: "Stałe pory posiłków",      desc: "Karmnik sam wydaje posiłek o ustawionych godzinach." },
  { icon: Settings2,  title: "Ustalone porcje",          desc: "Wybierasz liczbę porcji na posiłek — pomocne przy diecie pupila." },
  { icon: Shield,     title: "Szczelny zbiornik 2 L",    desc: "Chroni suchą karmę przed wilgocią i utratą świeżości." },
];

const faqs = [
  { q: "Czy działa bez internetu?",          a: "Tak. Harmonogram zapisany w urządzeniu działa bez internetu. WiFi jest potrzebne do podglądu z kamery i zmian w aplikacji." },
  { q: "Jaki rodzaj karmy mogę używać?",     a: "Wyłącznie suchą karmę (granulki). Karmnik nie nadaje się do karmy mokrej." },
  { q: "Ile karmy mieści zbiornik?",         a: "Zbiornik ma pojemność 2 litrów. Na ile dni wystarczy, zależy od wielkości pupila i porcji." },
  { q: "Czy zasilacz jest w zestawie?",      a: "Nie — zasilacz sieciowy nie jest dołączony. Wystarczy zwykła ładowarka USB 5V 2A, np. od telefonu." },
  { q: "Ile trwa dostawa?",                  a: "Zamówienia wysyłamy od producenta — dostawa trwa zwykle 5–10 dni roboczych. W Polsce dostawa jest darmowa od 200 zł, poniżej 20 zł." },
  { q: "Czy mogę zwrócić produkt?",          a: "Tak. Masz 14 dni na odstąpienie od umowy bez podania przyczyny, a reklamacje przyjmujemy przez 2 lata zgodnie z prawem konsumenckim." },
];

export function Landing({ products }: { products: Product[] }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const heroOpacity = useTransform(scrollYProgress, [0.45, 0.95], [1, 0]);

  return (
    <MotionConfig reducedMotion="user">
    <main id="main-content" className="min-h-screen bg-[#06060e] text-white overflow-x-hidden">

      <SiteNav />

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative sm:min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-12 sm:pt-28 sm:pb-20">
        {/* background orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] sm:w-[800px] sm:h-[800px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(34,211,238,0.12) 0%, transparent 70%)" }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto">

          {/* pill badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="glass rounded-full px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-semibold text-white/70 tracking-wider sm:tracking-widest uppercase mt-2 sm:mt-4 mb-5 sm:mb-8 inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            Inteligentne karmniki dla zwierząt
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[2.5rem] min-[400px]:text-5xl sm:text-6xl lg:text-8xl font-black leading-[1.05] tracking-tighter mb-4 sm:mb-6">
            Twój pupil{" "}
            <span className="text-gradient glow-text block">zawsze nakarmiony</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
            className="text-base sm:text-xl text-white/65 max-w-xl mb-6 sm:mb-10 leading-relaxed">
            Steruj z telefonu. Ustaw harmonogram. Wyjedź bez wyrzutów sumienia.{" "}
            <span className="text-white/80 font-medium">Karmnik z kamerą HD</span> zajmie się resztą.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-3 mb-10 sm:mb-16 w-full sm:w-auto">
            <AddToCartBtn className="text-base px-8 py-4 w-full sm:w-auto justify-center">
              Zamów teraz za 399 zł
            </AddToCartBtn>
            <a href="#jak-działa" className="btn-ghost text-sm px-6 py-3 sm:py-4 inline-flex items-center justify-center gap-2 w-full sm:w-auto">
              Jak działa?
              <ChevronDown className="h-4 w-4" />
            </a>
          </motion.div>

          {/* product image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[17rem] min-[400px]:max-w-xs sm:max-w-md mx-auto animate-float">

            {/* glow beneath */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 h-20 blur-3xl rounded-full animate-pulse-glow"
              style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.7) 0%, transparent 70%)" }} />

            <Image src={IMG} alt="Automatyczny karmnik z kamerą HD" width={480} height={532}
              className="relative w-full object-contain drop-shadow-[0_40px_80px_rgba(139,92,246,0.4)]"
              priority />

            {/* floating chips */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 0.6 }}
              className="absolute top-4 sm:top-8 -left-3 sm:-left-12 glass-bright rounded-xl sm:rounded-2xl px-2.5 py-2 sm:px-4 sm:py-3 flex items-center gap-2 sm:gap-3">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}>
                <Wifi className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">WiFi Ready</div>
                <div className="text-[10px] text-white/60 whitespace-nowrap">Zawsze online</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.15, duration: 0.6 }}
              className="absolute bottom-10 sm:bottom-16 -right-3 sm:-right-12 glass-bright rounded-xl sm:rounded-2xl px-2.5 py-2 sm:px-4 sm:py-3 flex items-center gap-2 sm:gap-3">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #f472b6, #8b5cf6)" }}>
                <Camera className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Kamera HD</div>
                <div className="text-[10px] text-white/60 whitespace-nowrap">Podgląd na żywo</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          aria-hidden="true"
          className="hidden xl:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-white/50">
          <span className="text-[10px] tracking-widest uppercase">Przewiń</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="border-y border-white/[0.06] py-8 sm:py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6 sm:gap-8 text-center">
          {[
            { v: "2 L",   l: "zbiornik na suchą karmę" },
            { v: "HD",    l: "kamera z podglądem na żywo" },
            { v: "WiFi",  l: "sterowanie z telefonu" },
            { v: "24/7",  l: "dba o Twojego pupila" },
          ].map(({ v, l }, i) => (
            <Reveal key={l} delay={i * 0.08}>
              <div className="text-3xl sm:text-4xl font-black text-gradient mb-1">{v}</div>
              <div className="text-xs text-white/60 uppercase tracking-wide">{l}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── COLLECTION ─── */}
      <section id="kolekcja" className="py-16 sm:py-28 px-4 sm:px-6 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <Reveal>
              <h2 className="text-3xl min-[400px]:text-4xl sm:text-5xl font-black tracking-tight">
                Wszystko dla{" "}
                <span className="text-gradient">pełnej miski</span>
              </h2>
              <p className="text-white/65 text-base sm:text-lg max-w-xl mx-auto mt-5 leading-relaxed">
                Karmniki z aplikacją i kamerą, karmnik dla dwóch pupili i fontanna ze świeżą wodą.
              </p>
            </Reveal>
          </div>
          <ProductGrid products={products} />
        </div>
      </section>

      {/* ─── PROBLEM ─── */}
      <section className="py-16 sm:py-28 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal delay={0.1}>
            <h2 className="text-3xl min-[400px]:text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
              Korek, nadgodziny,{" "}
              <span className="text-gradient-warm">a miska pusta</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/65 text-lg max-w-xl mx-auto mb-10 sm:mb-16 leading-relaxed">
              Życie jest nieprzewidywalne. Twój pies albo kot nie rozumie dlaczego miska jest pusta o 18:00. Do tej pory.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: BriefcaseBusiness, t: "Stres w pracy", d: "Myślisz o pupilu zamiast skupić się na pracy" },
              { icon: Car, t: "Korek w drodze", d: "Wracasz za późno, a pora karmienia już minęła" },
              { icon: Plane, t: "Wyjazd na weekend", d: "Prosisz bliskich o pomoc przy każdym wyjeździe" },
            ].map(({ icon: Icon, t, d }, i) => (
              <Reveal key={t} delay={0.1 * i} from="bottom">
                <div className="glass rounded-3xl p-6 text-left border border-white/[0.06] hover:border-purple-500/30 transition-colors">
                  <div className="h-11 w-11 rounded-2xl mb-5 flex items-center justify-center bg-purple-400/10 border border-purple-300/15">
                    <Icon className="h-5 w-5 text-purple-200" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{t}</h3>
                  <p className="text-sm text-white/65 leading-relaxed">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUCT DEEP DIVE ─── */}
      <section id="funkcje" className="py-14 sm:py-20 px-4 sm:px-6 scroll-mt-16 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Reveal from="left">
            <div className="relative max-w-xs sm:max-w-md lg:max-w-none mx-auto">
              <div className="absolute inset-0 -m-10 rounded-full blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)" }} />
              <Image src={IMG} alt="Automatyczny karmnik z kamerą HD" width={560} height={621}
                className="relative w-full object-contain drop-shadow-[0_60px_120px_rgba(139,92,246,0.35)]" />
            </div>
          </Reveal>
          <div className="space-y-8">
            <Reveal delay={0.1}>
              <h2 className="text-3xl min-[400px]:text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                Inteligentny karmnik{" "}
                <span className="text-gradient">dla psa i kota</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-white/65 leading-relaxed">
                Ten karmnik łączy precyzję z technologią. Zaprogramuj harmonogram, dobierz porcje
                i zapomnij o stresie — Twój pupil dostanie jedzenie zawsze na czas.
              </p>
            </Reveal>
            <div className="space-y-3">
              {[
                "Sterowanie przez aplikację iOS / Android",
                "WiFi — zarządzaj z dowolnego miejsca",
                "Kamera HD — podgląd karmienia na żywo",
                "Dodatkowa porcja zdalnie, jednym dotknięciem",
                "Szczelny zbiornik 2 L na suchą karmę",
                "Harmonogram działa także bez internetu",
              ].map((item, i) => (
                <Reveal key={item} delay={0.05 * i + 0.3}>
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }}>
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-white/70 text-sm">{item}</span>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.6}>
              <div className="flex flex-col min-[400px]:flex-row min-[400px]:items-center gap-4 sm:gap-5 pt-4">
                <div>
                  <div className="text-4xl font-black text-gradient">399 zł</div>
                  <div className="text-xs text-white/60 mt-0.5">darmowa dostawa w Polsce</div>
                </div>
                <AddToCartBtn className="min-[400px]:flex-1 w-full py-4 text-sm font-bold justify-center">
                  Dodaj do koszyka
                </AddToCartBtn>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section id="funkcje2" className="py-16 sm:py-28 px-4 sm:px-6 scroll-mt-16 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <Reveal>
              <h2 className="text-3xl min-[400px]:text-4xl sm:text-5xl font-black tracking-tight">
                Wszystko w{" "}
                <span className="text-gradient">jednym urządzeniu</span>
              </h2>
            </Reveal>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 0.07} from="bottom">
                <div className="glass rounded-3xl p-6 h-full border border-white/[0.06] hover:border-purple-500/40 hover:bg-white/[0.06] transition-[background-color,border-color] duration-300 group">
                  <div className="h-12 w-12 rounded-2xl mb-5 flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(34,211,238,0.2))", border: "1px solid rgba(139,92,246,0.3)" }}>
                    <Icon className="h-5 w-5 text-purple-300" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-white/65 leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="jak-działa" className="py-16 sm:py-28 px-4 sm:px-6 scroll-mt-16 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-20">
            <Reveal>
              <h2 className="text-3xl min-[400px]:text-4xl sm:text-5xl font-black tracking-tight">
                Gotowe w{" "}
                <span className="text-gradient">kilka minut</span>
              </h2>
            </Reveal>
          </div>
          <div className="grid sm:grid-cols-3 gap-10 sm:gap-8 relative">
            {/* connector line */}
            <div className="hidden sm:block absolute top-8 left-1/6 right-1/6 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(34,211,238,0.4), transparent)" }} />
            {[
              { n: "01", t: "Podłącz i skonfiguruj",  d: "Ustaw karmnik, podłącz do prądu i połącz z aplikacją przez WiFi." },
              { n: "02", t: "Ustaw harmonogram",       d: "Wybierz godziny i wielkość porcji. Aplikacja zapamiętuje wszystko automatycznie." },
              { n: "03", t: "Ciesz się spokojem",      d: "Wyjedź, idź do pracy, zrób zakupy. Karmnik zajmie się resztą." },
            ].map(({ n, t, d }, i) => (
              <Reveal key={n} delay={i * 0.12}>
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-2xl mb-6 flex items-center justify-center text-white font-black text-lg glow-purple-sm"
                    style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}>
                    {n}
                  </div>
                  <h3 className="font-bold text-white text-xl mb-3">{t}</h3>
                  <p className="text-white/65 text-sm leading-relaxed">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.4}>
            <div className="text-center mt-12 sm:mt-16">
              <AddToCartBtn className="px-6 sm:px-8 py-4 text-sm font-bold w-full sm:w-auto justify-center">
                Chcę spróbować — 399 zł <Zap className="h-4 w-4" />
              </AddToCartBtn>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="oferta" className="py-16 sm:py-28 px-4 sm:px-6 scroll-mt-16 border-t border-white/[0.04]">
        <div className="max-w-lg mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl min-[400px]:text-4xl font-black tracking-tight mb-10 sm:mb-12">Zadbaj o pupila już dziś</h2>
          </Reveal>
          <Reveal delay={0.15} from="scale">
            <div className="relative glass-bright rounded-3xl p-5 min-[400px]:p-8 border border-purple-500/20 glow-purple">
              {/* badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 btn-primary text-xs px-4 py-1.5 rounded-full whitespace-nowrap">
                Polecany
              </div>

              <div className="relative mx-auto w-48 mb-6">
                <div className="absolute inset-0 blur-2xl rounded-full animate-pulse-glow"
                  style={{ background: "radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)" }} />
                <Image src={IMG} alt="Automatyczny karmnik z kamerą HD" width={200} height={222}
                  className="relative w-full object-contain drop-shadow-2xl" />
              </div>

              <h3 className="text-2xl font-black text-white mb-1">Karmnik z kamerą HD</h3>
              <p className="text-white/65 text-sm mb-6">WiFi, aplikacja, zbiornik 2 L</p>
              <div className="text-5xl font-black text-gradient mb-8">399 zł</div>

              <ul className="space-y-3 text-sm text-left mb-8">
                {[
                  "Darmowa dostawa w Polsce",
                  "14 dni na odstąpienie od umowy",
                  "2 lata na reklamację zgodnie z prawem",
                  "Darmowa aplikacja iOS i Android",
                  "Bezpieczna płatność kartą lub PayPal",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/60">
                    <Check className="h-4 w-4 text-purple-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <AddToCartBtn className="w-full py-4 text-sm font-bold justify-center">
                Zamów karmnik z kamerą
              </AddToCartBtn>
              <p className="text-xs text-white/60 mt-4">Szyfrowane połączenie SSL · Płatności obsługuje Shopify</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-16 sm:py-28 px-4 sm:px-6 scroll-mt-16 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <Reveal>
              <h2 className="text-3xl min-[400px]:text-4xl font-black tracking-tight">
                Masz pytania?{" "}
                <span className="text-gradient">Mamy odpowiedzi.</span>
              </h2>
            </Reveal>
          </div>
          <Accordion className="space-y-2">
            {faqs.map(({ q, a }, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <AccordionItem value={`${i}`}
                  className="glass rounded-2xl border border-white/[0.06] px-4 sm:px-6 hover:border-purple-500/30 transition-colors data-[state=open]:border-purple-500/40">
                  <AccordionTrigger className="text-white font-semibold text-sm py-4 sm:py-5 text-left gap-4 hover:no-underline">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/65 text-sm leading-relaxed pb-5">
                    {a}
                  </AccordionContent>
                </AccordionItem>
              </Reveal>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 border-t border-white/[0.04] text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(139,92,246,0.2) 0%, transparent 60%)" }} />
        <Reveal>
          <h2 className="text-4xl min-[400px]:text-5xl sm:text-6xl font-black tracking-tight mb-6 flex flex-wrap items-center justify-center gap-x-3">
            Twój pupil na to{" "}
            <span className="text-gradient">zasługuje</span>
            <PawPrint className="h-10 w-10 sm:h-12 sm:w-12 text-purple-300" aria-hidden="true" />
          </h2>
          <p className="text-white/65 text-base sm:text-lg mb-8 sm:mb-10 max-w-md mx-auto">
            Ustaw harmonogram raz i wyjeżdżaj spokojnie — miska będzie pełna o czasie.
          </p>
          <AddToCartBtn className="px-6 sm:px-10 py-4 sm:py-5 text-sm sm:text-base font-bold w-full sm:w-auto justify-center">
            Zamów za 399 zł — darmowa dostawa
          </AddToCartBtn>
        </Reveal>
      </section>

      <SiteFooter />
    </main>
    </MotionConfig>
  );
}
