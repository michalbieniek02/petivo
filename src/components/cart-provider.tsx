"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { contentId, track } from "@/lib/tracking";

const STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "ecxva5-gd.myshopify.com";
const STORAGE_KEY = "petivo-cart";

export interface CartItem {
  variantId: number;
  handle: string;
  name: string;
  variantTitle: string | null;
  price: number;
  image: string;
  qty: number;
}

export type CartItemInput = Omit<CartItem, "qty">;

interface CartCtx {
  items: CartItem[];
  count: number;
  total: number;
  checkoutUrl: string;
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItemInput) => void;
  setQty: (variantId: number, qty: number) => void;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const loaded = useRef(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : [];
        if (Array.isArray(parsed)) setItems(parsed);
      } catch {}
      loaded.current = true;
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);

  const addItem = useCallback((item: CartItemInput) => {
    track("AddToCart", { content_ids: [contentId(item.variantId)], content_type: "product", content_name: item.name, value: item.price, currency: "PLN" });
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        return prev.map((i) => (i.variantId === item.variantId ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((variantId: number, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.variantId !== variantId) : prev.map((i) => (i.variantId === variantId ? { ...i, qty } : i)),
    );
  }, []);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const checkoutUrl = `https://${STORE}/cart/${items.map((i) => `${i.variantId}:${i.qty}`).join(",")}`;

  return (
    <Ctx.Provider
      value={{ items, count, total, checkoutUrl, open, openCart, closeCart, addItem, setQty }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
