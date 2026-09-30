"use client";
import { ShoppingBag } from "lucide-react";
import { ReactNode } from "react";
import { useCart, CartItemInput } from "./cart-provider";

interface Props {
  item: CartItemInput;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "ghost";
  disabled?: boolean;
}

export function AddToCartBtn({ item, children, className = "", variant = "primary", disabled }: Props) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() => addItem(item)}
      disabled={disabled}
      className={`${variant === "primary" ? "btn-primary" : "btn-ghost"} min-h-11 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <ShoppingBag className="h-4 w-4" />
      {children}
    </button>
  );
}
