"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ArrowRight, Package, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "./cart-provider";
import { formatPrice } from "@/lib/products";

export function CartDrawer() {
  const { items, count, total, checkoutUrl, open, closeCart, setQty } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col"
            style={{ background: "#0e0e1a", borderLeft: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-purple-400" />
                <span className="font-bold text-white">Koszyk {count > 0 && `(${count})`}</span>
              </div>
              <button onClick={closeCart} aria-label="Zamknij koszyk"
                className="h-8 w-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                  <div className="h-16 w-16 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
                    <Package className="h-7 w-7 text-purple-400" />
                  </div>
                  <p className="text-white/40 text-sm">Koszyk jest pusty</p>
                  <button onClick={closeCart}
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-4">
                    Wróć do sklepu
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 rounded-2xl p-4"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <Image src={item.image} alt={item.name} width={72} height={72}
                        className="h-[72px] w-[72px] object-contain rounded-xl bg-white/5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm truncate">{item.name}</p>
                        {item.variantTitle && <p className="text-white/40 text-xs mt-0.5 truncate">{item.variantTitle}</p>}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center rounded-full border border-white/10">
                            <button onClick={() => setQty(item.variantId, item.qty - 1)} aria-label="Zmniejsz ilość"
                              className="h-7 w-7 flex items-center justify-center text-white/50 hover:text-white">
                              {item.qty === 1 ? <Trash2 className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                            </button>
                            <span className="w-6 text-center text-sm text-white">{item.qty}</span>
                            <button onClick={() => setQty(item.variantId, item.qty + 1)} aria-label="Zwiększ ilość"
                              className="h-7 w-7 flex items-center justify-center text-white/50 hover:text-white">
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-purple-300 font-bold text-sm">{formatPrice(item.price * item.qty)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-6 border-t border-white/[0.06] space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Razem</span>
                  <span className="text-2xl font-black text-white">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-white/30 text-center">{total >= 200 ? "Darmowa dostawa w Polsce" : "Dostawa w Polsce 20 zł, darmowa od 200 zł"} · Bezpieczna płatność</p>
                <a href={checkoutUrl}
                  className="btn-primary py-4 text-sm font-bold w-full inline-flex items-center justify-center gap-2">
                  Przejdź do płatności
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function CartButton() {
  const { count, openCart } = useCart();
  if (count === 0) return null;

  return (
    <button onClick={openCart} aria-label="Otwórz koszyk"
      className="relative h-9 w-9 flex items-center justify-center rounded-full text-white/60 hover:text-white transition-colors"
      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
      <ShoppingBag className="h-4 w-4" />
      <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}>
        {count}
      </span>
    </button>
  );
}
