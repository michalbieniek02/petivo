"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ArrowRight, Package } from "lucide-react";
import { useCart } from "./cart-provider";

const VARIANT_ID = "gid://shopify/ProductVariant/58834277204342";
const IMG = "https://cdn.shopify.com/s/files/1/1020/7222/2070/files/S5ed485c8135e4785821a1f551c7ce25cQ.webp?v=1790565478";

export function CartDrawer() {
  const { cart, open, closeCart, addItem, adding } = useCart();

  const qty = cart?.lines.edges.reduce((s, e) => s + e.node.quantity, 0) ?? 0;
  const total = cart ? parseFloat(cart.cost.totalAmount.amount) : 0;

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={closeCart}
            />
            {/* drawer */}
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col"
              style={{ background: "#0e0e1a", borderLeft: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5 text-purple-400" />
                  <span className="font-bold text-white">Koszyk {qty > 0 && `(${qty})`}</span>
                </div>
                <button onClick={closeCart} className="h-8 w-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {!cart || qty === 0 ? (
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
                  <div className="space-y-4">
                    {cart.lines.edges.map(({ node }) => (
                      <div key={node.id} className="flex items-center gap-4 rounded-2xl p-4"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <img src={IMG} alt="Petivo Auto" className="h-16 w-16 object-contain rounded-xl"
                          style={{ background: "rgba(255,255,255,0.05)" }} />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white text-sm truncate">Petivo Auto</p>
                          <p className="text-white/40 text-xs mt-0.5">Inteligentny karmnik</p>
                          <p className="text-purple-300 font-bold mt-1">
                            {(parseFloat(node.merchandise.priceV2.amount) * node.quantity).toFixed(2)} zł
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <span>×{node.quantity}</span>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => addItem(VARIANT_ID)}
                      disabled={adding}
                      className="w-full text-sm text-white/40 hover:text-white/70 transition-colors py-2"
                    >
                      + Dodaj kolejny
                    </button>
                  </div>
                )}
              </div>

              {/* footer */}
              {cart && qty > 0 && (
                <div className="px-6 py-6 border-t border-white/[0.06] space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Razem</span>
                    <span className="text-2xl font-black text-white">{total.toFixed(2)} zł</span>
                  </div>
                  <p className="text-xs text-white/30 text-center">Bezpłatna dostawa · SSL · Bezpieczna płatność</p>
                  <a
                    href={cart.checkoutUrl}
                    className="btn-primary block text-center py-4 text-sm font-bold w-full inline-flex items-center justify-center gap-2"
                  >
                    Przejdź do płatności
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function CartButton() {
  const { cart, openCart } = useCart();
  const qty = cart?.lines.edges.reduce((s, e) => s + e.node.quantity, 0) ?? 0;

  if (qty === 0) return null;

  return (
    <button onClick={openCart}
      className="relative h-9 w-9 flex items-center justify-center rounded-full text-white/60 hover:text-white transition-colors"
      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
      <ShoppingBag className="h-4 w-4" />
      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}>
        {qty}
      </span>
    </button>
  );
}
