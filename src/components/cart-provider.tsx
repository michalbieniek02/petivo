"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Cart, createCart, addToCart, buildLocalCart } from "@/lib/shopify";

interface CartCtx {
  cart: Cart | null;
  open: boolean;
  adding: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (merchandiseId: string) => Promise<void>;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  const addItem = useCallback(async (merchandiseId: string) => {
    setAdding(true);
    try {
      let updated: Cart;
      if (cart && cart.id === "local") {
        const currentQty = cart.lines.edges.reduce((s, e) => s + e.node.quantity, 0);
        updated = buildLocalCart(currentQty + 1);
      } else if (cart) {
        updated = await addToCart(cart.id, merchandiseId);
      } else {
        updated = await createCart(merchandiseId);
      }
      setCart(updated);
      setOpen(true);
    } catch {
      const currentQty = cart?.lines.edges.reduce((s, e) => s + e.node.quantity, 0) ?? 0;
      setCart(buildLocalCart(currentQty + 1));
      setOpen(true);
    } finally {
      setAdding(false);
    }
  }, [cart]);

  return (
    <Ctx.Provider value={{ cart, open, adding, openCart: () => setOpen(true), closeCart: () => setOpen(false), addItem }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
