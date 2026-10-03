"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { useEffect, useRef, type KeyboardEvent } from "react";
import { X, ShoppingBag, ArrowRight, Package, Minus, Plus, Trash2, Lock } from "lucide-react";
import { useCart } from "./cart-provider";
import { formatPrice } from "@/lib/products";
import { FREE_SHIPPING_FROM as FREE_SHIPPING, SHIPPING_PL } from "@/lib/shop";
const FOCUSABLE = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";

function trapFocus(event: KeyboardEvent<HTMLElement>) {
  if (event.key !== "Tab") return;
  const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE));
  const first = focusable[0];
  const last = focusable.at(-1);
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export function CartDrawer() {
  const { items, count, total, checkoutUrl, open, closeCart, setQty } = useCart();
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open, closeCart]);

  return (
    <MotionConfig reducedMotion="user">
    <AnimatePresence>
      {open && (
        <>
          <motion.button type="button" aria-label="Zamknij koszyk" tabIndex={-1}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.aside
            role="dialog" aria-modal="true" aria-labelledby="cart-title"
            onKeyDown={trapFocus}
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 h-dvh z-50 w-full max-w-md flex flex-col"
            style={{ background: "#0e0e1a", borderLeft: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-purple-400" />
                <span id="cart-title" className="font-bold text-white">Koszyk {count > 0 && `(${count})`}</span>
              </div>
              <button ref={closeButton} onClick={closeCart} aria-label="Zamknij koszyk"
                className="h-11 w-11 rounded-full flex items-center justify-center text-white/65 hover:text-white hover:bg-white/10 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                  <div className="h-16 w-16 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
                    <Package className="h-7 w-7 text-purple-400" />
                  </div>
                  <p className="text-white/70 text-sm">Koszyk jest pusty</p>
                  <Link href="/#kolekcja" onClick={closeCart} className="btn-ghost min-h-11 px-5 inline-flex items-center text-sm">
                    Zobacz produkty
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-3 sm:gap-4 rounded-2xl p-3 sm:p-4"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <Image src={item.image} alt={item.name} width={72} height={72}
                        className="h-[72px] w-[72px] object-contain rounded-xl bg-white/5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <Link href={`/produkt/${item.handle}`} onClick={closeCart}
                          className="block font-semibold text-white text-sm truncate hover:text-purple-200 transition-colors">
                          {item.name}
                        </Link>
                        {item.variantTitle && <p className="text-white/65 text-xs mt-0.5 truncate">{item.variantTitle}</p>}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center rounded-full border border-white/10">
                            <button onClick={() => setQty(item.variantId, item.qty - 1)} aria-label={item.qty === 1 ? `Usuń ${item.name} z koszyka` : `Zmniejsz ilość ${item.name}`}
                              className="h-9 w-9 flex items-center justify-center text-white/65 hover:text-white">
                              {item.qty === 1 ? <Trash2 className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                            </button>
                            <span className="w-6 text-center text-sm text-white">{item.qty}</span>
                            <button onClick={() => setQty(item.variantId, item.qty + 1)} aria-label={`Zwiększ ilość ${item.name}`}
                              className="h-9 w-9 flex items-center justify-center text-white/65 hover:text-white">
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-white font-semibold text-sm tabular-nums">{formatPrice(item.price * item.qty)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-4 sm:px-6 py-4 sm:py-6 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-white/[0.06] space-y-4">
                <div>
                  <p className="text-xs text-white/75 mb-2">
                    {total >= FREE_SHIPPING
                      ? "Masz darmową dostawę w Polsce"
                      : <>Do darmowej dostawy brakuje <strong className="text-white">{formatPrice(FREE_SHIPPING - total)}</strong></>}
                  </p>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10" role="progressbar"
                    aria-valuemin={0} aria-valuemax={FREE_SHIPPING} aria-valuenow={Math.min(total, FREE_SHIPPING)}
                    aria-label="Postęp do darmowej dostawy">
                    <div className="h-full rounded-full transition-[width] duration-500"
                      style={{ width: `${Math.min(100, (total / FREE_SHIPPING) * 100)}%`, background: "linear-gradient(90deg, #8b5cf6, #22d3ee)" }} />
                  </div>
                </div>
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between items-baseline">
                    <dt className="text-white/65">Produkty</dt>
                    <dd className="font-display text-2xl font-bold text-white tabular-nums">{formatPrice(total)}</dd>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <dt className="text-white/65">Dostawa w Polsce</dt>
                    <dd className="text-white/85 tabular-nums">{total >= FREE_SHIPPING ? "Gratis" : formatPrice(SHIPPING_PL)}</dd>
                  </div>
                </dl>
                <a href={checkoutUrl}
                  className="btn-primary min-h-12 py-4 text-sm font-bold w-full inline-flex items-center justify-center gap-2">
                  Przejdź do płatności
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <p className="text-xs text-white/60 text-center inline-flex w-full items-center justify-center gap-1.5">
                  <Lock className="h-3 w-3" aria-hidden="true" /> Karta lub PayPal · płatność obsługuje Shopify
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
    </MotionConfig>
  );
}

export function CartButton() {
  const { count, openCart } = useCart();

  return (
    <button onClick={openCart} aria-label={count > 0 ? `Otwórz koszyk, liczba produktów: ${count}` : "Otwórz koszyk"}
      className="relative h-11 w-11 flex items-center justify-center rounded-full text-white/70 hover:text-white transition-colors"
      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full text-[11px] font-bold text-white flex items-center justify-center tabular-nums"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}>
          {count}
        </span>
      )}
    </button>
  );
}
