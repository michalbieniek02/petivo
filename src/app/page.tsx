"use client";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/scroll-reveal";
import { AddToCartBtn } from "@/components/add-to-cart-btn";
import { CartButton } from "@/components/cart-drawer";
import {
  Wifi, Smartphone, Clock, Shield, Star, Check,
  ArrowRight, Zap, Settings2, Bell, ChevronDown,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const IMG =
  "https://cdn.shopify.com/s/files/1/1020/7222/2070/files/S5ed485c8135e4785821a1f551c7ce25cQ.webp?v=1790565478";

const features = [
  { icon: Wifi,       title: "WiFi & Cloud",          desc: "Steruj z telefonu z dowolnego miejsca na świecie. Zawsze online." },
  { icon: Smartphone, title: "Aplikacja iOS/Android",  desc: "Intuicyjny interfejs. Harmonogramy, powiadomienia, historia karmień." },
  { icon: Clock,      title: "10 posiłków dziennie",   desc: "Precyzyjny timer — Twój pupil je zawsze o tej samej porze." },
  { icon: Settings2,  title: "Dokładne porcje",        desc: "Reguluj gramaturę co do grama. Idealne dla zwierząt na diecie." },
  { icon: Bell,       title: "Alerty push",            desc: "Powiadomisz się gdy karma się kończy lub posiłek nie został pobrany." },
  { icon: Shield,     title: "Hermetyczny zbiornik",   desc: "3,5L szczelnego pojemnika — karma zawsze świeża i chrupiąca." },
];

const testimonials = [
  {
    name: "Anna K.",
    sub: "Właścicielka kota Mizia",
    text: "Wyjeżdżam na weekend bez stresu. Aplikacja działa perfekcyjnie, koty zawsze mają jedzenie na czas. Absolutny hit.",
  },
  {
    name: "Marcin W.",
    sub: "Właściciel psa Burego",
    text: "Pracuję do późna. Petivo Auto rozwiązało ten problem raz na zawsze. Bury jest szczęśliwy, ja mam spokojną głowę.",
  },
  {
    name: "Kasia i Tomek",
    sub: "Właściciele 2 kotów",
    text: "Solidny metal, łatwy do czyszczenia, elementy do zmywarki. Karmimy dwa koty z jednego urządzenia. Polecamy.",
  },
];

const faqs = [
  { q: "Czy działa bez internetu?",                   a: "Tak. Raz zaprogramowany harmonogram działa offline. WiFi potrzebne jest tylko do zdalnego sterowania z aplikacji." },
  { q: "Jaki rodzaj karmy mogę używać?",              a: "Wyłącznie sucha karma (krokiety) w standardowym rozmiarze. Nie nadaje się do karmy mokrej ani przysmaków w kawałkach." },
  { q: "Ile karmy mieści zbiornik?",                  a: "Zbiornik ma pojemność 3,5 litra — to ok. 2–3 tygodnie dla jednego zwierzęcia przy standardowych porcjach." },
  { q: "iOS i Android?",                              a: "Tak — aplikacja Petivo dostępna bezpłatnie w App Store (iOS 12+) i Google Play (Android 7+)." },
  { q: "Ile czasu zajmuje wysyłka?",                  a: "Zamówienia złożone przed 14:00 wysyłamy tego samego dnia. Dostawa DPD / InPost: 1–2 dni robocze." },
  { q: "Czy mogę zwrócić produkt?",                   a: "30 dni na zwrot bez podania przyczyny. 2 lata gwarancji producenta. Wsparcie po polsku." },
];

export default function Page() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main className="min-h-screen bg-[#06060e] text-white overflow-x-hidden">

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 h-16 glass border-b border-white/[0.06]">
        <a href="/" className="flex items-baseline gap-2">
          <span className="text-xl font-black tracking-tight text-gradient">PETIVO</span>
          <span className="text-[10px] text-white/40 font-semibold tracking-[0.2em] uppercase">AUTO</span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
          {["Funkcje", "Jak działa", "Opinie", "FAQ"].map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(" ", "")}`}
              className="hover:text-white transition-colors duration-200">
              {l}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <CartButton />
          <AddToCartBtn className="text-sm px-5 py-2.5">
            Kup za 399 zł
          </AddToCartBtn>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
        {/* background orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(34,211,238,0.12) 0%, transparent 70%)" }} />

        {/* grid pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "80px 80px" }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto">

          {/* pill badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="glass rounded-full px-4 py-1.5 text-xs font-semibold text-white/60 tracking-widest uppercase mb-8 inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            Inteligentne karmniki dla zwierząt
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-8xl font-black leading-[1.02] tracking-tighter mb-6">
            Twój pupil{" "}
            <span className="text-gradient glow-text block">zawsze nakarmiony</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
            className="text-lg sm:text-xl text-white/50 max-w-xl mb-10 leading-relaxed">
            Steruj z telefonu. Ustaw harmonogram. Wyjedź bez wyrzutów sumienia.{" "}
            <span className="text-white/80 font-medium">Petivo Auto</span> zajmie się resztą.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-3 mb-16">
            <AddToCartBtn className="text-base px-8 py-4">
              Zamów teraz za 399 zł
            </AddToCartBtn>
            <a href="#jak-działa" className="btn-ghost text-sm px-6 py-4 inline-flex items-center gap-2">
              Jak działa?
              <ChevronDown className="h-4 w-4" />
            </a>
          </motion.div>

          {/* product image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm sm:max-w-md mx-auto animate-float">

            {/* glow beneath */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 h-20 blur-3xl rounded-full animate-pulse-glow"
              style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.7) 0%, transparent 70%)" }} />

            <Image src={IMG} alt="Petivo Auto dozownik karmy" width={480} height={480}
              className="relative w-full object-contain drop-shadow-[0_40px_80px_rgba(139,92,246,0.4)]"
              priority />

            {/* floating chips */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 0.6 }}
              className="absolute top-8 -left-4 sm:-left-12 glass-bright rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}>
                <Wifi className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">WiFi Ready</div>
                <div className="text-[10px] text-white/40">Zawsze online</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.15, duration: 0.6 }}
              className="absolute bottom-16 -right-4 sm:-right-12 glass-bright rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #f472b6, #8b5cf6)" }}>
                <Star className="h-4 w-4 text-white fill-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">4.9 / 5.0</div>
                <div className="text-[10px] text-white/40">12 000+ opinii</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
          <span className="text-[10px] tracking-widest uppercase">Przewiń</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="border-y border-white/[0.06] py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { v: "12 000+",  l: "zadowolonych właścicieli" },
            { v: "399 zł",   l: "jedyna słuszna cena" },
            { v: "4.9 ★",   l: "średnia ocen klientów" },
            { v: "24/7",     l: "dba o Twojego pupila" },
          ].map(({ v, l }, i) => (
            <Reveal key={l} delay={i * 0.08}>
              <div className="text-3xl sm:text-4xl font-black text-gradient mb-1">{v}</div>
              <div className="text-xs text-white/40 uppercase tracking-wide">{l}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── PROBLEM ─── */}
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-purple-400 mb-4">Znasz to?</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
              Korek, nadgodziny,{" "}
              <span className="text-gradient-warm">a miska pusta</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/50 text-lg max-w-xl mx-auto mb-16 leading-relaxed">
              Życie jest nieprzewidywalne. Twój pies albo kot nie rozumie dlaczego miska jest pusta o 18:00. Do tej pory.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { e: "😰", t: "Stres w pracy",        d: "Myślisz o pupilem zamiast skupić się na robocie" },
              { e: "🚗", t: "Korek w drodze",        d: "Wracasz za późno, miska od rana pusta" },
              { e: "✈️", t: "Wyjazd na weekend",     d: "Prosisz sąsiadkę po raz dziesiąty w tym miesiącu" },
            ].map(({ e, t, d }, i) => (
              <Reveal key={t} delay={0.1 * i} from="bottom">
                <div className="glass rounded-3xl p-6 text-left border border-white/[0.06] hover:border-purple-500/30 transition-colors">
                  <div className="text-3xl mb-4">{e}</div>
                  <h3 className="font-bold text-white mb-2">{t}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUCT DEEP DIVE ─── */}
      <section id="funkcje" className="py-20 px-6 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <Reveal from="left">
            <div className="relative">
              <div className="absolute inset-0 -m-10 rounded-full blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)" }} />
              <Image src={IMG} alt="Petivo Auto" width={560} height={560}
                className="relative w-full object-contain drop-shadow-[0_60px_120px_rgba(139,92,246,0.35)]" />
            </div>
          </Reveal>
          <div className="space-y-8">
            <Reveal delay={0.1}>
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-cyan-400">Petivo Auto</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 leading-tight">
                Inteligentny karmnik{" "}
                <span className="text-gradient">dla psa i kota</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-white/50 leading-relaxed">
                Petivo Auto łączy precyzję z technologią. Zaprogramuj harmonogram, dobierz porcje
                i zapomnij o stresie — Twój pupil dostanie jedzenie zawsze na czas.
              </p>
            </Reveal>
            <div className="space-y-3">
              {[
                "Sterowanie przez aplikację iOS / Android",
                "WiFi — zarządzaj z dowolnego miejsca",
                "Do 10 posiłków dziennie z precyzyjnymi porcjami",
                "Zbiornik 3,5L z hermetycznym zamknięciem",
                "Powiadomienia push gdy karma się kończy",
                "Elementy zbiornika bezpieczne do zmywarki",
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
              <div className="flex items-center gap-5 pt-4">
                <div>
                  <div className="text-4xl font-black text-gradient">399 zł</div>
                  <div className="text-xs text-white/30 mt-0.5">dostawa gratis</div>
                </div>
                <AddToCartBtn className="flex-1 py-4 text-sm font-bold justify-center">
                  Dodaj do koszyka
                </AddToCartBtn>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section id="funkcje2" className="py-28 px-6 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-purple-400 mb-4">Funkcje</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
                Wszystko w{" "}
                <span className="text-gradient">jednym urządzeniu</span>
              </h2>
            </Reveal>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 0.07} from="bottom">
                <div className="glass rounded-3xl p-6 h-full border border-white/[0.06] hover:border-purple-500/40 hover:bg-white/[0.06] transition-all duration-300 group">
                  <div className="h-12 w-12 rounded-2xl mb-5 flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(34,211,238,0.2))", border: "1px solid rgba(139,92,246,0.3)" }}>
                    <Icon className="h-5 w-5 text-purple-300" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="jak-działa" className="py-28 px-6 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-cyan-400 mb-4">Jak działa</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
                Gotowe w{" "}
                <span className="text-gradient">3 minuty</span>
              </h2>
            </Reveal>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* connector line */}
            <div className="hidden sm:block absolute top-8 left-1/6 right-1/6 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(34,211,238,0.4), transparent)" }} />
            {[
              { n: "01", t: "Podłącz i skonfiguruj",  d: "Ustaw Petivo Auto, podłącz do prądu. Skonfiguruj przez aplikację w 3 minuty." },
              { n: "02", t: "Ustaw harmonogram",       d: "Wybierz godziny i wielkość porcji. Aplikacja zapamiętuje wszystko automatycznie." },
              { n: "03", t: "Ciesz się spokojem",      d: "Wyjedź, idź do pracy, zrób zakupy. Petivo Auto zajmie się resztą." },
            ].map(({ n, t, d }, i) => (
              <Reveal key={n} delay={i * 0.12}>
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-2xl mb-6 flex items-center justify-center text-white font-black text-lg glow-purple-sm"
                    style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}>
                    {n}
                  </div>
                  <h3 className="font-bold text-white text-xl mb-3">{t}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.4}>
            <div className="text-center mt-16">
              <AddToCartBtn className="px-8 py-4 text-sm font-bold">
                Chcę spróbować — 399 zł <Zap className="h-4 w-4" />
              </AddToCartBtn>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="opinie" className="py-28 px-6 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-pink-400 mb-4">Opinie</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
                12 000+ szczęśliwych{" "}
                <span className="text-gradient-warm">właścicieli</span>
              </h2>
            </Reveal>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {testimonials.map(({ name, sub, text }, i) => (
              <Reveal key={name} delay={i * 0.1}>
                <div className="glass rounded-3xl p-6 h-full border border-white/[0.06] hover:border-pink-500/30 transition-colors">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed mb-6">"{text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-black text-white"
                      style={{ background: "linear-gradient(135deg, #f472b6, #8b5cf6)" }}>
                      {name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{name}</div>
                      <div className="text-[11px] text-white/30">{sub}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="oferta" className="py-28 px-6 border-t border-white/[0.04]">
        <div className="max-w-lg mx-auto text-center">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-purple-400 mb-4">Oferta</p>
            <h2 className="text-4xl font-black tracking-tight mb-12">Zadbaj o pupila już dziś</h2>
          </Reveal>
          <Reveal delay={0.15} from="scale">
            <div className="relative glass-bright rounded-3xl p-8 border border-purple-500/20 glow-purple">
              {/* badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 btn-primary text-xs px-4 py-1.5 rounded-full whitespace-nowrap">
                Najczęściej wybierany
              </div>

              <div className="relative mx-auto w-48 mb-6">
                <div className="absolute inset-0 blur-2xl rounded-full animate-pulse-glow"
                  style={{ background: "radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)" }} />
                <Image src={IMG} alt="Petivo Auto" width={200} height={200}
                  className="relative w-full object-contain drop-shadow-2xl" />
              </div>

              <h3 className="text-2xl font-black text-white mb-1">Petivo Auto</h3>
              <p className="text-white/40 text-sm mb-6">Inteligentny dozownik karmy</p>
              <div className="text-5xl font-black text-gradient mb-8">399 zł</div>

              <ul className="space-y-3 text-sm text-left mb-8">
                {[
                  "Darmowa dostawa DPD / InPost",
                  "30 dni na zwrot bez pytań",
                  "2 lata gwarancji producenta",
                  "Aplikacja iOS i Android gratis",
                  "Wsparcie techniczne po polsku",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/60">
                    <Check className="h-4 w-4 text-purple-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <AddToCartBtn className="w-full py-4 text-sm font-bold justify-center">
                Zamów Petivo Auto
              </AddToCartBtn>
              <p className="text-xs text-white/20 mt-4">SSL · Bezpieczna płatność · Gwarancja satysfakcji</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-28 px-6 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-cyan-400 mb-4">FAQ</p>
              <h2 className="text-4xl font-black tracking-tight">
                Masz pytania?{" "}
                <span className="text-gradient">Mamy odpowiedzi.</span>
              </h2>
            </Reveal>
          </div>
          <Accordion className="space-y-2">
            {faqs.map(({ q, a }, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <AccordionItem value={`${i}`}
                  className="glass rounded-2xl border border-white/[0.06] px-6 hover:border-purple-500/30 transition-colors data-[state=open]:border-purple-500/40">
                  <AccordionTrigger className="text-white font-semibold text-sm py-5 text-left hover:no-underline">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/40 text-sm leading-relaxed pb-5">
                    {a}
                  </AccordionContent>
                </AccordionItem>
              </Reveal>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-24 px-6 border-t border-white/[0.04] text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(139,92,246,0.2) 0%, transparent 60%)" }} />
        <Reveal>
          <p className="text-5xl sm:text-6xl font-black tracking-tight mb-6">
            Twój pupil na to{" "}
            <span className="text-gradient">zasługuje</span> 🐾
          </p>
          <p className="text-white/40 text-lg mb-10 max-w-md mx-auto">
            Dołącz do 12 000+ właścicieli, którzy śpią spokojnie wiedząc, że ich zwierzak ma zawsze pełną miskę.
          </p>
          <AddToCartBtn className="px-10 py-5 text-base font-bold">
            Zamów za 399 zł — dostawa gratis
          </AddToCartBtn>
        </Reveal>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/[0.06] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-gradient">PETIVO</span>
            <span className="text-[10px] text-white/30 font-semibold tracking-[0.2em] uppercase">AUTO</span>
          </div>
          <div className="flex gap-6 text-xs text-white/30">
            <a href="#oferta" className="hover:text-white transition-colors">Sklep</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <span>📧 kontakt@petivo.pl</span>
          </div>
          <p className="text-xs text-white/20">© 2025 Petivo. Wszelkie prawa zastrzeżone.</p>
        </div>
      </footer>
    </main>
  );
}
