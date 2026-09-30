"use client";
import { useCart } from "./cart-provider";
import { ShoppingBag, Loader2 } from "lucide-react";
import { ReactNode } from "react";

const VARIANT_ID = "gid://shopify/ProductVariant/58834277204342";

interface Props {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "ghost";
}

export function AddToCartBtn({ children, className = "", variant = "primary" }: Props) {
  const { addItem, adding } = useCart();

  return (
    <button
      onClick={() => addItem(VARIANT_ID)}
      disabled={adding}
      className={`${variant === "primary" ? "btn-primary" : "btn-ghost"} inline-flex items-center gap-2 ${adding ? "opacity-75 cursor-not-allowed" : ""} ${className}`}
    >
      {adding ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ShoppingBag className="h-4 w-4" />
      )}
      {children}
    </button>
  );
}
