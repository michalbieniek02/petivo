import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product, formatPrice } from "@/lib/products";
import { categoryById } from "@/lib/categories";
import { ProductStage } from "./product-stage";

function variantsLabel(n: number) {
  const few = n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14);
  return `${n} ${few ? "warianty" : "wariantów"}`;
}

export function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const hasVariants = product.variants.length > 1;
  const category = categoryById(product.category);
  const cover = product.gallery.find((g) => g.kind !== "cutout");

  const visual = product.cutout ? (
    <ProductStage src={product.cutout} alt={product.name}
      className={featured ? "aspect-square lg:aspect-auto lg:h-full lg:min-h-[26rem]" : "aspect-square"}
      sizes={featured ? "(max-width: 1024px) 100vw, 40vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"} />
  ) : cover ? (
    <div className={`relative overflow-hidden rounded-2xl ${featured ? "aspect-square lg:aspect-auto lg:h-full lg:min-h-[26rem]" : "aspect-square"} ${cover.kind === "photo" ? "bg-[var(--panel)]" : "bg-white"}`}>
      <Image src={cover.src} alt={product.name} fill
        sizes={featured ? "(max-width: 1024px) 100vw, 40vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        className={cover.kind === "photo" ? "object-cover" : "object-contain p-5"} />
    </div>
  ) : (
    <div className="relative aspect-square rounded-2xl overflow-hidden bg-white">
      <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-contain p-6" />
    </div>
  );

  return (
    <Link href={`/produkt/${product.handle}`}
      className={`group relative surface rounded-3xl p-2.5 h-full flex hover:bg-[var(--surface-hover)] hover:border-white/[0.16] focus-visible:border-purple-300 transition-[border-color,background-color] duration-300 ${featured ? "flex-col lg:flex-row lg:items-stretch" : "flex-col"}`}>
      <span className="absolute top-5 left-5 z-10 rounded-full border border-white/10 bg-[#06060e]/70 px-2.5 py-1 text-xs font-semibold text-white/80 backdrop-blur">
        {category.singular}
      </span>
      <div className={featured ? "lg:w-[55%]" : ""}>{visual}</div>
      <div className={`flex flex-col flex-1 px-3 pb-3 pt-5 ${featured ? "lg:px-10 lg:py-10 lg:justify-center" : ""}`}>
        <h3 className={`font-bold text-white leading-tight ${featured ? "text-2xl lg:text-4xl" : "text-lg"}`}>{product.name}</h3>
        <p className={`text-white/65 leading-snug mt-2 ${featured ? "text-base lg:text-lg" : "text-sm"}`}>{product.tagline}</p>
        {hasVariants && <p className="mt-2 text-xs text-white/60">{variantsLabel(product.variants.length)}</p>}
        <div className={`flex items-center justify-between gap-4 mt-auto pt-5 ${featured ? "lg:mt-8 lg:pt-0" : ""}`}>
          <div className={`font-display font-bold text-white tabular-nums ${featured ? "text-3xl" : "text-xl"}`}>
            {hasVariants && <span className="text-xs font-semibold text-white/60 mr-1.5 font-sans">od</span>}
            {formatPrice(product.minPrice)}
          </div>
          <span className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${featured ? "btn-primary min-h-11 px-5 py-2.5" : "text-white/75 group-hover:text-white"}`}>
            Zobacz <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
