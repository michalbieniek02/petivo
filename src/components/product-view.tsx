"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronRight, CreditCard, Factory, RotateCcw, Truck } from "lucide-react";
import { Product, formatPrice } from "@/lib/products";
import { categoryById } from "@/lib/categories";
import { FREE_SHIPPING_FROM, SHIPPING_PL } from "@/lib/shop";
import { AddToCartBtn } from "./add-to-cart-btn";
import { ProductCard } from "./product-card";
import { ProductStage } from "./product-stage";
import { ProductSafety } from "./product-safety";
import { SiteNav } from "./site-nav";
import { SiteFooter } from "./site-footer";

export function ProductView({ product, others }: { product: Product; others: Product[] }) {
  const [variant, setVariant] = useState(product.variants[0]);
  const [imageIdx, setImageIdx] = useState(0);
  const buyRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);

  // Mobile buy bar: shown once the main "add to cart" button has scrolled above the viewport.
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    // The root is stretched far downwards, so "not intersecting" means only "scrolled past the top".
    // A plain observer misses jumps from below the viewport straight to above it (fast flings, anchors).
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting), { rootMargin: "0px 0px 100000px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const variantCutout = variant.image?.startsWith("/products/") ? variant.image : null;
  const cutout = variantCutout ?? product.cutout;
  const gallery = cutout ? [cutout, ...product.images] : product.images;
  const mainImage = gallery[imageIdx] ?? gallery[0];
  const showStage = imageIdx === 0 && cutout;
  const category = categoryById(product.category);

  const selectVariant = (v: typeof variant) => {
    setVariant(v);
    if (v.image?.startsWith("/products/")) return setImageIdx(0);
    const idx = v.image ? gallery.indexOf(v.image) : -1;
    if (idx >= 0) setImageIdx(idx);
  };

  const cartImage = product.optionName && variant.image ? variant.image : product.cutout ?? product.images[0];
  const cartItem = {
    variantId: variant.id,
    handle: product.handle,
    name: product.name,
    variantTitle: product.optionName ? variant.title : null,
    price: variant.price,
    image: cartImage,
  };
  const freeShipping = variant.price >= FREE_SHIPPING_FROM;

  return (
    <main id="main-content" className="min-h-dvh bg-[#06060e] text-white overflow-x-clip">
      <SiteNav />

      <section className="pt-20 sm:pt-24 pb-14 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <nav aria-label="Okruszki" className="mb-5 sm:mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/60">
              <li><Link href="/#kolekcja" className="hover:text-white transition-colors">Sklep</Link></li>
              <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
              <li>{category.label}</li>
              <li aria-hidden="true" className="hidden sm:block"><ChevronRight className="h-3.5 w-3.5" /></li>
              <li aria-current="page" className="hidden sm:block text-white/80 truncate max-w-[40ch]">{product.name}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-14">
            <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
              {showStage ? (
                <ProductStage src={mainImage} alt={product.name} priority padding="p-[14%]"
                  radius="rounded-3xl" className="aspect-square border border-white/[0.07]" sizes="(max-width: 1024px) 100vw, 55vw" />
              ) : (
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-white">
                  <Image src={mainImage} alt={product.name} fill priority sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-contain p-6" />
                </div>
              )}
              {gallery.length > 1 && (
                <div className="flex gap-2.5 mt-2 py-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-1.5">
                  {gallery.map((src, i) => (
                    <button key={src} type="button" onClick={() => setImageIdx(i)} aria-label={`Zdjęcie ${i + 1} z ${gallery.length}`} aria-pressed={i === imageIdx}
                      className={`relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-[border-color,opacity] ${i === 0 && cutout ? "bg-white/[0.06]" : "bg-white"} ${i === imageIdx ? "border-purple-400" : "border-transparent opacity-60 hover:opacity-100"}`}>
                      <Image src={src} alt="" fill sizes="80px" className="object-contain p-1.5" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="eyebrow mb-3">{category.singular}</p>
              <h1 className="text-3xl min-[400px]:text-4xl sm:text-5xl font-extrabold leading-[1.08] hyphens-auto break-words">{product.name}</h1>
              <p className="text-lg text-white/65 mt-3 leading-snug">{product.tagline}</p>

              <div className="mt-6 sm:mt-8 flex items-baseline gap-3">
                <span className="font-display text-4xl font-bold tabular-nums">{formatPrice(variant.price)}</span>
                {variant.compareAt && variant.compareAt > variant.price && (
                  <span className="text-lg text-white/60 line-through">{formatPrice(variant.compareAt)}</span>
                )}
              </div>
              <p className="text-sm text-white/60 mt-1.5">
                {freeShipping ? "Darmowa dostawa w Polsce" : `Dostawa w Polsce ${SHIPPING_PL} zł, darmowa od ${FREE_SHIPPING_FROM} zł`}
              </p>

              {product.optionName && (
                <fieldset className="mt-7">
                  <legend className="text-xs font-semibold tracking-[0.16em] uppercase text-white/65 mb-3">{product.optionName}</legend>
                  <div className="grid min-[480px]:grid-cols-2 gap-2">
                    {product.variants.map((v) => (
                      <button key={v.id} type="button" onClick={() => selectVariant(v)} aria-pressed={v.id === variant.id}
                        className={`min-h-12 flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm text-left border transition-colors ${v.id === variant.id ? "border-purple-400 bg-purple-500/15 text-white" : "border-white/10 text-white/75 hover:border-white/30 hover:text-white"}`}>
                        <span>{v.title}</span>
                        <span className="shrink-0 text-white/65 tabular-nums">{formatPrice(v.price)}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              <div ref={buyRef} className="mt-7">
                <AddToCartBtn className="w-full justify-center min-h-14 text-base font-bold" item={cartItem}>
                  Dodaj do koszyka
                </AddToCartBtn>
              </div>

              <ul className="mt-5 grid sm:grid-cols-2 gap-x-5 gap-y-3 text-sm text-white/70 surface rounded-2xl p-4">
                <li className="flex items-start gap-2.5"><CreditCard className="h-4 w-4 mt-0.5 shrink-0 text-cyan-200" aria-hidden="true" /> Bezpieczna płatność kartą lub PayPal</li>
                <li className="flex items-start gap-2.5"><RotateCcw className="h-4 w-4 mt-0.5 shrink-0 text-cyan-200" aria-hidden="true" /> 14 dni na odstąpienie od umowy</li>
                <li className="flex items-start gap-2.5"><Truck className="h-4 w-4 mt-0.5 shrink-0 text-cyan-200" aria-hidden="true" /> Darmowa dostawa w Polsce od {FREE_SHIPPING_FROM} zł · zwykle 5–10 dni roboczych</li>
                <li className="flex items-start gap-2.5"><Factory className="h-4 w-4 mt-0.5 shrink-0 text-cyan-200" aria-hidden="true" /> Producent: {product.vendor}</li>
              </ul>

              <div className="product-desc mt-10 pt-10 border-t border-white/[0.06]"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
              <ProductSafety handle={product.handle} title={product.name} />
            </div>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="py-14 sm:py-20 px-4 sm:px-6 border-t border-white/[0.05]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-8">Zobacz też</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {others.map((p) => <ProductCard key={p.handle} product={p} />)}
            </div>
          </div>
        </section>
      )}
      <SiteFooter />
      {/* keeps the footer reachable above the mobile buy bar */}
      <div aria-hidden="true" className="h-20 lg:hidden" />

      <div aria-hidden={!showBar} inert={!showBar}
        className={`lg:hidden fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[var(--panel)]/95 backdrop-blur px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-300 ${showBar ? "translate-y-0" : "translate-y-full"}`}>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-white/65 truncate">{product.optionName ? `${product.name} · ${variant.title}` : product.name}</p>
            <p className="font-display text-lg font-bold tabular-nums">{formatPrice(variant.price)}</p>
          </div>
          <AddToCartBtn className="min-h-12 px-5 text-sm justify-center shrink-0" item={cartItem}>
            Do koszyka
          </AddToCartBtn>
        </div>
      </div>
    </main>
  );
}
