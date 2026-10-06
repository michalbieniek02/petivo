"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { useEffect, useRef, type KeyboardEvent } from "react";
import { X, ShoppingBag, ArrowRight, Package, Minus, Plus, Trash2, Lock } from "lucide-react";
import { useCart } from "./cart-provider";
import { formatPrice } from "@/lib/products";
import { FREE_SHIPPING_FROM as FREE_SHIPPING, SHIPPING_PL } from "@/lib/shop";
import { contentId, track } from "@/lib/tracking";
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

/** A cheap accessory offered in the cart when the basket is below free shipping. */
export interface CartSuggestion {
  variantId: number;
  handle: string;
  name: string;
  short: string;
  variantTitle: string | null;
  price: number;
  image: string;
}

export function CartDrawer({ suggestions = [] }: { suggestions?: CartSuggestion[] }) {
  const { items, count, total, checkoutUrl, open, closeCart, setQty, addItem } = useCart();
  const missing = FREE_SHIPPING - total;
  const offers = missing > 0
    ? suggestions.filter((s) => !items.some((i) => i.handle === s.handle)).sort((a, b) => a.price - b.price).slice(0, 2)
    : [];
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
            className="fixed inset-0 z-50 bg-ink/45 backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.aside
            role="dialog" aria-modal="true" aria-labelledby="cart-title"
            onKeyDown={trapFocus}
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 h-dvh z-50 w-full max-w-md flex flex-col bg-background border-l border-neutral-warm/55 shadow-[-20px_0_60px_-30px_rgba(27,54,68,0.5)]"
          >
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-neutral-warm/55">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-accent-primary-strong" aria-hidden="true" />
                <span id="cart-title" className="font-display text-xl text-ink">Koszyk {count > 0 && `(${count})`}</span>
              </div>
              <button ref={closeButton} onClick={closeCart} aria-label="Zamknij koszyk"
                className="h-11 w-11 rounded-full flex items-center justify-center text-ink/75 hover:text-ink hover:bg-ink/[0.06] transition-colors">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                  <div className="h-16 w-16 rounded-full flex items-center justify-center bg-sand">
                    <Package className="h-7 w-7 text-accent-primary-strong" aria-hidden="true" />
                  </div>
                  <p className="font-display text-xl text-ink">Koszyk jest pusty</p>
                  <Link href="/#kolekcja" onClick={closeCart} className="btn-ghost min-h-11 px-5 inline-flex items-center text-sm">
                    Zobacz produkty
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-3 sm:gap-4 rounded-2xl p-3 sm:p-4 surface">
                      <Image src={item.image} alt={item.name} width={72} height={72}
                        className={`h-[72px] w-[72px] rounded-xl bg-sand flex-shrink-0 ${item.image.startsWith("/products/") ? "object-contain p-1.5" : "object-cover"}`} />
                      <div className="flex-1 min-w-0">
                        <Link href={`/produkt/${item.handle}`} onClick={closeCart}
                          className="block font-semibold text-ink text-sm truncate hover:text-accent-primary-strong transition-colors">
                          {item.name}
                        </Link>
                        {item.variantTitle && <p className="text-ink/75 text-xs mt-0.5 truncate">{item.variantTitle}</p>}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center rounded-full border border-neutral-warm/80 bg-background">
                            <button onClick={() => setQty(item.variantId, item.qty - 1)} aria-label={item.qty === 1 ? `Usuń ${item.name} z koszyka` : `Zmniejsz ilość ${item.name}`}
                              className="h-9 w-9 flex items-center justify-center text-ink/75 hover:text-ink">
                              {item.qty === 1 ? <Trash2 className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                            </button>
                            <span className="w-6 text-center text-sm text-ink tabular-nums">{item.qty}</span>
                            <button onClick={() => setQty(item.variantId, item.qty + 1)} aria-label={`Zwiększ ilość ${item.name}`}
                              className="h-9 w-9 flex items-center justify-center text-ink/75 hover:text-ink">
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-ink font-semibold text-sm tabular-nums">{formatPrice(item.price * item.qty)}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {offers.length > 0 && (
                    <div className="pt-3">
                      <p className="text-sm font-semibold text-ink">Dobierz do darmowej dostawy</p>
                      <p className="text-xs text-ink/75 mt-0.5">Brakuje {formatPrice(missing)}. Te drobiazgi przydadzą się każdemu pupilowi.</p>
                      <ul className="mt-3 space-y-2">
                        {offers.map((o) => (
                          <li key={o.variantId} className="flex items-center gap-3 rounded-2xl border border-dashed border-neutral-warm p-2.5">
                            <Image src={o.image} alt="" width={48} height={48}
                              className={`h-12 w-12 rounded-xl bg-sand flex-shrink-0 ${o.image.startsWith("/products/") ? "object-contain p-1" : "object-cover"}`} />
                            <span className="min-w-0 flex-1">
                              <Link href={`/produkt/${o.handle}`} onClick={closeCart} className="block truncate text-sm font-medium text-ink hover:text-accent-primary-strong">{o.short}</Link>
                              <span className="block text-xs text-ink/75 tabular-nums">{o.variantTitle ? `${o.variantTitle} · ` : ""}{formatPrice(o.price)}</span>
                            </span>
                            <button type="button" onClick={() => addItem({ variantId: o.variantId, handle: o.handle, name: o.name, variantTitle: o.variantTitle, price: o.price, image: o.image })} aria-label={`Dodaj do koszyka: ${o.name}`}
                              className="min-h-10 shrink-0 rounded-full bg-accent-primary-strong px-3.5 text-xs font-semibold text-white hover:bg-ink transition-colors inline-flex items-center gap-1">
                              <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Dodaj
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-4 sm:px-6 py-4 sm:py-6 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-neutral-warm/55 bg-card space-y-4">
                <div>
                  <p className="text-xs text-ink/85 mb-2">
                    {total >= FREE_SHIPPING
                      ? "Masz darmową dostawę w Polsce"
                      : <>Do darmowej dostawy brakuje <strong className="text-ink">{formatPrice(FREE_SHIPPING - total)}</strong></>}
                  </p>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-sand" role="progressbar"
                    aria-valuemin={0} aria-valuemax={FREE_SHIPPING} aria-valuenow={Math.min(total, FREE_SHIPPING)}
                    aria-label="Postęp do darmowej dostawy">
                    <div className="h-full rounded-full transition-[width] duration-500"
                      style={{ width: `${Math.min(100, (total / FREE_SHIPPING) * 100)}%`, background: total >= FREE_SHIPPING ? "var(--accent-primary)" : "linear-gradient(90deg, var(--promo), var(--accent-secondary))" }} />
                  </div>
                </div>
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between items-baseline">
                    <dt className="text-ink/75">Produkty</dt>
                    <dd className="font-display text-2xl font-semibold text-ink tabular-nums">{formatPrice(total)}</dd>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <dt className="text-ink/75">Dostawa w Polsce</dt>
                    <dd className="text-ink tabular-nums">{total >= FREE_SHIPPING ? "Gratis" : formatPrice(SHIPPING_PL)}</dd>
                  </div>
                </dl>
                <a href={checkoutUrl}
                  onClick={() => track("InitiateCheckout", { content_ids: items.map((i) => contentId(i.variantId)), content_type: "product", num_items: count, value: total, currency: "PLN" })}
                  className="btn-primary min-h-12 py-4 text-sm w-full inline-flex items-center justify-center gap-2">
                  Przejdź do płatności
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <p className="text-xs text-ink/75 text-center inline-flex w-full items-center justify-center gap-1.5">
                  <Lock className="h-3 w-3" aria-hidden="true" /> BLIK, karta, PayPal · płatność obsługuje Shopify
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
      className="relative h-11 w-11 flex items-center justify-center rounded-full text-ink bg-card border border-neutral-warm/80 hover:border-ink/40 transition-colors">
      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full text-[11px] font-bold text-white bg-accent-primary-strong flex items-center justify-center tabular-nums">
          {count}
        </span>
      )}
    </button>
  );
}
