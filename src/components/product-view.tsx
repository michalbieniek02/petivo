"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, CreditCard, Factory, RotateCcw } from "lucide-react";
import { Product, formatPrice } from "@/lib/products";
import { AddToCartBtn } from "./add-to-cart-btn";
import { ProductCard } from "./product-card";
import { ProductStage } from "./product-stage";
import { SiteNav } from "./site-nav";

export function ProductView({ product, others }: { product: Product; others: Product[] }) {
  const [variant, setVariant] = useState(product.variants[0]);
  const [imageIdx, setImageIdx] = useState(0);

  const gallery = product.cutout ? [product.cutout, ...product.images] : product.images;
  const mainImage = gallery[imageIdx] ?? gallery[0];
  const showStage = imageIdx === 0 && product.cutout;

  const selectVariant = (v: typeof variant) => {
    setVariant(v);
    const idx = v.image ? gallery.indexOf(v.image) : -1;
    if (idx >= 0) setImageIdx(idx);
  };

  const cartImage = product.optionName && variant.image ? variant.image : product.cutout ?? product.images[0];

  return (
    <main className="min-h-screen bg-[#06060e] text-white overflow-x-hidden">
      <SiteNav />

      <section className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/#kolekcja" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Wszystkie produkty
          </Link>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            <div>
              {showStage ? (
                <ProductStage src={mainImage} alt={product.name} priority padding="p-[14%]"
                  className="aspect-square glass border border-white/[0.06]" sizes="(max-width: 1024px) 100vw, 50vw" />
              ) : (
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-white">
                  <Image src={mainImage} alt={product.name} fill priority sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain p-6" />
                </div>
              )}
              {gallery.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                  {gallery.map((src, i) => (
                    <button key={src} onClick={() => setImageIdx(i)} aria-label={`Zdjęcie ${i + 1}`}
                      className={`relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${i === 0 && product.cutout ? "bg-white/[0.06]" : "bg-white"} ${i === imageIdx ? "border-purple-500" : "border-transparent opacity-60 hover:opacity-100"}`}>
                      <Image src={src} alt="" fill sizes="80px" className="object-contain p-1.5" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:pt-4">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
                <span className="text-gradient">{product.name}</span>
              </h1>
              <p className="text-lg text-white/60 mt-3 leading-snug">{product.tagline}</p>

              <div className="flex items-baseline gap-3 mt-8">
                <span className="text-4xl font-black text-white">{formatPrice(variant.price)}</span>
                {variant.compareAt && variant.compareAt > variant.price && (
                  <span className="text-lg text-white/30 line-through">{formatPrice(variant.compareAt)}</span>
                )}
              </div>

              {product.optionName && (
                <div className="mt-8">
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-3">{product.optionName}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button key={v.id} onClick={() => selectVariant(v)} disabled={!v.available}
                        className={`rounded-xl px-4 py-2.5 text-sm border transition-colors disabled:opacity-30 disabled:line-through ${v.id === variant.id ? "border-purple-500 bg-purple-500/15 text-white" : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"}`}>
                        {v.title}
                        <span className="ml-2 text-white/40">{formatPrice(v.price)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <AddToCartBtn
                disabled={!variant.available}
                className="w-full justify-center py-4 text-base font-bold mt-8"
                item={{
                  variantId: variant.id,
                  handle: product.handle,
                  name: product.name,
                  variantTitle: product.optionName ? variant.title : null,
                  price: variant.price,
                  image: cartImage,
                }}
              >
                {variant.available ? "Dodaj do koszyka" : "Chwilowo niedostępny"}
              </AddToCartBtn>

              <ul className="mt-6 space-y-2 text-sm text-white/50">
                <li className="flex items-center gap-3"><CreditCard className="h-4 w-4 text-purple-400" /> Bezpieczna płatność kartą lub PayPal</li>
                <li className="flex items-center gap-3"><RotateCcw className="h-4 w-4 text-purple-400" /> 14 dni na odstąpienie od umowy</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-purple-400" /> Darmowa dostawa w Polsce od 200 zł · zwykle 5–10 dni roboczych</li>
                <li className="flex items-center gap-3"><Factory className="h-4 w-4 text-purple-400" /> {product.vendor === "Bez marki" ? "Produkt bez marki producenta" : `Producent: ${product.vendor}`}</li>
              </ul>

              <div className="product-desc mt-10 pt-10 border-t border-white/[0.06]"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
            </div>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="py-20 px-4 sm:px-6 border-t border-white/[0.04]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-black tracking-tight mb-10">Zobacz też</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {others.map((p) => <ProductCard key={p.handle} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
