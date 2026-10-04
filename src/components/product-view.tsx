"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronRight, CreditCard, Factory, RotateCcw, Truck } from "lucide-react";
import { Product, formatPrice } from "@/lib/products";
import { categoryById } from "@/lib/categories";
import { FREE_SHIPPING_FROM, SHIPPING_PL } from "@/lib/shop";
import { AddToCartBtn } from "./add-to-cart-btn";
import { ProductCard } from "./product-card";
import { ProductGallery, type GallerySlide } from "./product-gallery";
import { ProductSafety } from "./product-safety";
import { SiteNav } from "./site-nav";
import { SiteFooter } from "./site-footer";

/** Sizes like "40 cm", "50 cm" read better in numeric order; other values keep Shopify's order. */
function sortValues(values: string[]) {
  if (!values.every((v) => /\d/.test(v))) return values;
  return [...values].sort((a, b) => parseFloat(a.replace(",", ".").match(/[\d.]+/)![0]) - parseFloat(b.replace(",", ".").match(/[\d.]+/)![0]));
}

export function ProductView({ product, others }: { product: Product; others: Product[] }) {
  // Start on the cheapest variant, with the gallery already showing that variant's photo.
  const initialVariant = [...product.variants].sort((a, b) => a.price - b.price)[0];
  const [variant, setVariant] = useState(initialVariant);
  const [imageIdx, setImageIdx] = useState(() => {
    const i = initialVariant.image ? product.gallery.findIndex((s) => s.src === initialVariant.image || s.shopifySrc === initialVariant.image) : -1;
    return i >= 0 ? i + (product.cutout ? 1 : 0) : 0;
  });
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

  // Main packshots (e.g. black/white colour variants) replace the first slide;
  // other variant images (fountain with filters) are slides further in the gallery.
  const isPrimaryCutout = (src: string | null) => !!src && src.startsWith("/products/") && !src.startsWith("/products/gallery/");
  const primary = isPrimaryCutout(variant.image) ? variant.image : product.cutout;
  const slides: GallerySlide[] = [
    ...(primary ? [{ src: primary, kind: "cutout" as const, width: 1, height: 1 }] : []),
    ...product.gallery,
  ];
  const category = categoryById(product.category);

  const selectVariant = (v: typeof variant) => {
    setVariant(v);
    if (isPrimaryCutout(v.image)) return setImageIdx(0);
    const idx = v.image ? product.gallery.findIndex((s) => s.src === v.image || s.shopifySrc === v.image) : -1;
    if (idx >= 0) setImageIdx(idx + (primary ? 1 : 0));
  };

  // Picking a value keeps the other options when that combination exists, otherwise jumps to the first variant with that value.
  const chooseOption = (i: number, value: string) => {
    const next =
      product.variants.find((v) => v.options[i] === value && v.options.every((o, j) => j === i || o === variant.options[j])) ??
      product.variants.find((v) => v.options[i] === value);
    if (next) selectVariant(next);
  };

  const cartImage = product.optionName && variant.image ? variant.image : product.packshot ?? product.images[0];
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
    <main id="main-content" className="min-h-dvh bg-background text-ink overflow-x-clip">
      <SiteNav />

      <section className="pt-20 sm:pt-24 pb-14 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <nav aria-label="Okruszki" className="mb-5 sm:mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink/75">
              <li><Link href="/#kolekcja" className="hover:text-ink underline-offset-4 hover:underline decoration-accent-primary">Sklep</Link></li>
              <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
              <li>{category.label}</li>
              <li aria-hidden="true" className="hidden sm:block"><ChevronRight className="h-3.5 w-3.5" /></li>
              <li aria-current="page" className="hidden sm:block text-ink truncate max-w-[40ch]">{product.name}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-14">
            <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
              <ProductGallery slides={slides} name={product.name} index={imageIdx} onIndex={setImageIdx} />
            </div>

            <div className="min-w-0">
              <p className="eyebrow mb-3">{category.singular}</p>
              <h1 className="text-[2rem] leading-[1.08] min-[400px]:text-4xl sm:text-5xl hyphens-auto break-words">{product.name}</h1>
              <p className="text-lg text-ink/80 mt-3 leading-snug">{product.tagline}</p>

              <div className="mt-6 sm:mt-8 flex items-baseline gap-3">
                <span className="font-display text-4xl text-ink tabular-nums">{formatPrice(variant.price)}</span>
                {variant.compareAt && variant.compareAt > variant.price && (
                  <span className="text-lg text-ink/70 line-through">{formatPrice(variant.compareAt)}</span>
                )}
              </div>
              <p className="text-sm text-ink/75 mt-1.5">
                {freeShipping ? "Darmowa dostawa w Polsce" : `Dostawa w Polsce ${SHIPPING_PL} zł, darmowa od ${FREE_SHIPPING_FROM} zł`}
              </p>

              {product.options.length > 1 ? (
                // two or more options (e.g. colour + size): one button group per option
                product.options.map((opt, i) => {
                  const priceFor = (value: string) =>
                    product.variants.find((v) => v.options[i] === value && v.options.every((o, j) => j === i || o === variant.options[j]))?.price;
                  const prices = opt.values.map(priceFor).filter((x): x is number => x !== undefined);
                  const showPrice = new Set(prices).size > 1;
                  return (
                    <fieldset key={opt.name} className="mt-6">
                      <legend className="text-xs font-semibold tracking-[0.16em] uppercase text-accent-secondary-strong mb-3">
                        {opt.name}: <span className="normal-case tracking-normal text-ink">{variant.options[i]}</span>
                      </legend>
                      <div className="flex flex-wrap gap-2">
                        {sortValues(opt.values).map((value) => {
                          const exists = product.variants.some((v) => v.options[i] === value);
                          if (!exists) return null;
                          const price = priceFor(value);
                          const active = variant.options[i] === value;
                          return (
                            <button key={value} type="button" onClick={() => chooseOption(i, value)} aria-pressed={active}
                              className={`min-h-11 rounded-xl px-4 py-2 text-sm border transition-colors ${active ? "border-ink bg-ink text-background" : "border-neutral-warm/80 bg-card text-ink hover:border-ink/45"} ${price === undefined ? "opacity-60" : ""}`}>
                              {value}
                              {showPrice && price !== undefined && <span className={`ml-2 tabular-nums ${active ? "text-neutral-warm" : "text-ink/75"}`}>{formatPrice(price)}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  );
                })
              ) : product.optionName && (
                <fieldset className="mt-7">
                  <legend className="text-xs font-semibold tracking-[0.16em] uppercase text-accent-secondary-strong mb-3">{product.optionName}</legend>
                  <div className="grid min-[480px]:grid-cols-2 gap-2">
                    {product.variants.map((v) => (
                      <button key={v.id} type="button" onClick={() => selectVariant(v)} aria-pressed={v.id === variant.id}
                        className={`min-h-12 flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm text-left border transition-colors ${v.id === variant.id ? "border-ink bg-ink text-background" : "border-neutral-warm/80 bg-card text-ink hover:border-ink/45"}`}>
                        <span>{v.title}</span>
                        <span className={`shrink-0 tabular-nums ${v.id === variant.id ? "text-neutral-warm" : "text-ink/75"}`}>{formatPrice(v.price)}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              <div ref={buyRef} className="mt-7">
                <AddToCartBtn className="w-full justify-center min-h-14 text-base" item={cartItem}>
                  Dodaj do koszyka
                </AddToCartBtn>
              </div>

              <ul className="mt-5 grid sm:grid-cols-2 gap-x-5 gap-y-3 text-sm text-ink/85 bg-sand/70 border border-neutral-warm/55 rounded-2xl p-4">
                <li className="flex items-start gap-2.5"><CreditCard className="h-4 w-4 mt-0.5 shrink-0 text-accent-secondary-strong" aria-hidden="true" /> Bezpieczna płatność kartą lub PayPal</li>
                <li className="flex items-start gap-2.5"><RotateCcw className="h-4 w-4 mt-0.5 shrink-0 text-accent-secondary-strong" aria-hidden="true" /> 14 dni na odstąpienie od umowy</li>
                <li className="flex items-start gap-2.5"><Truck className="h-4 w-4 mt-0.5 shrink-0 text-accent-secondary-strong" aria-hidden="true" /> Darmowa dostawa w Polsce od {FREE_SHIPPING_FROM} zł · zwykle 5–10 dni roboczych</li>
                <li className="flex items-start gap-2.5"><Factory className="h-4 w-4 mt-0.5 shrink-0 text-accent-secondary-strong" aria-hidden="true" /> Producent: {product.vendor}</li>
              </ul>

              <div className="product-desc mt-10 pt-10 border-t border-neutral-warm/55"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
              <ProductSafety handle={product.handle} />
            </div>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="py-14 sm:py-20 px-4 sm:px-6 border-t border-neutral-warm/55">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl mb-8">Zobacz <span className="accent-script">też</span></h2>
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
        className={`lg:hidden fixed inset-x-0 bottom-0 z-30 border-t border-neutral-warm/55 bg-background/95 backdrop-blur px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-300 ${showBar ? "translate-y-0" : "translate-y-full"}`}>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-ink/75 truncate">{product.optionName ? `${product.name} · ${variant.title}` : product.name}</p>
            <p className="font-display text-xl text-ink tabular-nums">{formatPrice(variant.price)}</p>
          </div>
          <AddToCartBtn className="min-h-12 px-5 text-sm justify-center shrink-0" item={cartItem}>
            Do koszyka
          </AddToCartBtn>
        </div>
      </div>
    </main>
  );
}
