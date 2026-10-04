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
  const frame = featured ? "aspect-[4/3] sm:aspect-square lg:aspect-auto lg:h-full lg:min-h-[26rem]" : "aspect-square sm:aspect-[4/5]";
  const sizes = featured ? "(max-width: 1024px) 100vw, 40vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  const visual = product.cutout ? (
    <ProductStage src={product.cutout} alt={product.name} className={frame} sizes={sizes} />
  ) : cover ? (
    <div className={`relative overflow-hidden rounded-[1.25rem] ${frame} ${cover.kind === "photo" ? "bg-sand" : "bg-white"}`}>
      <Image src={cover.src} alt={product.name} fill sizes={sizes}
        className={`transition-transform duration-700 ease-out group-hover:scale-[1.04] ${cover.kind === "photo" ? "object-cover" : "object-contain p-5"}`} />
    </div>
  ) : (
    <div className={`relative overflow-hidden rounded-[1.25rem] bg-white ${frame}`}>
      <Image src={product.images[0]} alt={product.name} fill sizes={sizes} className="object-contain p-6" />
    </div>
  );

  return (
    <Link href={`/produkt/${product.handle}`}
      className={`group relative surface rounded-[1.75rem] p-2.5 h-full flex hover:border-ink/30 hover:shadow-[0_24px_48px_-28px_rgba(27,54,68,0.45)] transition-[border-color,box-shadow] duration-300 ${featured ? "flex-col lg:flex-row lg:items-stretch" : "flex-col"}`}>
      <span className="absolute top-5 left-5 z-10 rounded-full bg-background/95 px-3 py-1 text-xs font-semibold text-accent-primary-strong backdrop-blur">
        {category.singular}
      </span>
      <div className={featured ? "lg:w-[55%]" : ""}>{visual}</div>
      <div className={`flex flex-col flex-1 px-3 pb-3 pt-5 ${featured ? "lg:px-10 lg:py-10 lg:justify-center" : ""}`}>
        {featured && <p className="mb-3 inline-flex self-start rounded-full bg-badge-deep px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">Polecamy na start</p>}
        <h3 className={`text-ink leading-tight ${featured ? "text-2xl lg:text-4xl" : "text-xl"}`}>{product.name}</h3>
        <p className={`text-ink/75 leading-snug mt-2 ${featured ? "text-base lg:text-lg" : "text-sm"}`}>{product.tagline}</p>
        {hasVariants && <p className="mt-2 text-xs font-medium text-accent-secondary-strong">{variantsLabel(product.variants.length)}</p>}
        <div className={`flex items-center justify-between gap-4 mt-auto pt-5 ${featured ? "lg:mt-8 lg:pt-0" : ""}`}>
          <div className={`font-display text-ink tabular-nums ${featured ? "text-3xl" : "text-2xl"}`}>
            {hasVariants && <span className="text-xs font-sans font-semibold text-ink/70 mr-1.5">od</span>}
            {formatPrice(product.minPrice)}
          </div>
          <span className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${featured ? "btn-primary min-h-11 px-5 py-2.5" : "h-10 w-10 justify-center rounded-full bg-accent-primary/15 text-accent-primary-strong group-hover:bg-accent-primary-strong group-hover:text-white"}`}>
            {featured ? "Zobacz" : <span className="sr-only">Zobacz</span>}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
