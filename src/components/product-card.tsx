import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product, formatPrice } from "@/lib/products";
import { ProductStage } from "./product-stage";

export function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const hasVariants = product.variants.length > 1;

  const visual = product.cutout ? (
    <ProductStage src={product.cutout} alt={product.name}
      className={featured ? "aspect-square lg:aspect-auto lg:h-full" : "aspect-square"}
      sizes={featured ? "(max-width: 1024px) 100vw, 40vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"} />
  ) : (
    <div className="relative aspect-square rounded-3xl overflow-hidden bg-white">
      <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-contain p-6" />
    </div>
  );

  return (
    <Link href={`/produkt/${product.handle}`}
      className={`group relative glass rounded-[2rem] p-3 h-full flex border border-white/[0.06] hover:border-purple-500/40 transition-colors duration-300 ${featured ? "flex-col lg:flex-row lg:items-stretch" : "flex-col"}`}>
      {featured && (
        <span className="absolute top-6 left-6 z-10 btn-primary text-[10px] px-3 py-1 rounded-full">Polecany</span>
      )}
      <div className={featured ? "lg:w-1/2" : ""}>{visual}</div>
      <div className={`flex flex-col flex-1 px-3 pb-3 pt-5 ${featured ? "lg:px-10 lg:py-10 lg:justify-center" : ""}`}>
        <h3 className={`font-black text-white leading-tight ${featured ? "text-2xl lg:text-4xl tracking-tight" : "text-lg"}`}>{product.name}</h3>
        <p className={`text-white/45 leading-snug mt-2 flex-1 ${featured ? "text-base lg:text-lg lg:flex-none lg:mb-8" : "text-sm mb-5"}`}>{product.tagline}</p>
        <div className="flex items-center justify-between gap-4">
          <div className={`font-black text-gradient ${featured ? "text-3xl" : "text-xl"}`}>
            {hasVariants && <span className="text-xs font-semibold text-white/40 mr-1.5">od</span>}
            {formatPrice(product.minPrice)}
          </div>
          <span className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${featured ? "btn-primary px-5 py-2.5" : "text-white/60 group-hover:text-white"}`}>
            Zobacz <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
