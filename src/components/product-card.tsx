import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product, formatPrice } from "@/lib/products";
import { categoryById } from "@/lib/categories";
import { ProductStage } from "./product-stage";

/** Polish plural: 1 kolor, 2–4 kolory, 5+ kolorów (12–14 also "kolorów"). */
function plural(n: number, one: string, few: string, many: string) {
  if (n === 1) return `${n} ${one}`;
  const isFew = n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14);
  return `${n} ${isFew ? few : many}`;
}

/** Number of colours, when the product has a colour option. */
function coloursOf(product: Product) {
  const opt = product.options.find((o) => /kolor/i.test(o.name));
  return opt ? opt.values.length : 0;
}

export function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const hasVariants = product.variants.length > 1;
  const category = categoryById(product.category);
  const cover = product.gallery.find((g) => g.kind !== "cutout");
  const colours = coloursOf(product);
  const variantsNote = colours > 1 ? plural(colours, "kolor", "kolory", "kolorów") : plural(product.variants.length, "wariant", "warianty", "wariantów");
  const frame = featured ? "aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[28rem]" : "aspect-square";
  const sizes = featured ? "(max-width: 1024px) 100vw, 45vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  const visual = product.packshot ? (
    <ProductStage src={product.packshot} alt={product.name} className={frame} sizes={sizes} padding={featured ? "p-[14%]" : "p-[13%]"} />
  ) : cover ? (
    <div className={`relative overflow-hidden rounded-[1.5rem] bg-sand ${frame}`}>
      <Image src={cover.src} alt={product.name} fill sizes={sizes} className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
    </div>
  ) : null;

  if (featured) {
    return (
      <Link href={`/produkt/${product.handle}`}
        className="group relative grid lg:grid-cols-[1.15fr_1fr] h-full overflow-hidden rounded-[2rem] bg-card border border-neutral-warm/55 hover:shadow-[0_30px_60px_-36px_rgba(35,57,74,0.55)] transition-shadow duration-300">
        <div className="relative p-2.5 lg:p-3">{visual}</div>
        <div className="flex flex-col justify-center px-6 pb-7 pt-4 lg:px-10 lg:py-10">
          <p className="inline-flex self-start rounded-full bg-badge-deep px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">Polecamy na start</p>
          <h3 className="text-3xl lg:text-[2.6rem] leading-[1.05] text-ink mt-4">{product.name}</h3>
          <p className="text-ink/75 text-base lg:text-lg leading-snug mt-3">{product.tagline}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mt-7">
            <span className="font-display text-3xl text-ink tabular-nums">
              {hasVariants && <span className="font-sans text-sm font-semibold text-ink/75 mr-1.5">od</span>}
              {formatPrice(product.minPrice)}
            </span>
            <span className="btn-primary min-h-11 px-5 inline-flex items-center gap-1.5 text-sm">
              Zobacz <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </span>
          </div>
          {hasVariants && <p className="mt-4 text-sm text-accent-secondary-strong">{variantsNote} do wyboru</p>}
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/produkt/${product.handle}`} className="group flex h-full flex-col rounded-[1.5rem] focus-visible:outline-offset-4">
      <div className="relative">
        {visual}
        <span className="absolute top-3.5 left-3.5 z-10 rounded-full bg-background/95 px-3 py-1 text-xs font-semibold text-accent-primary-strong">
          {category.singular}
        </span>
        <span aria-hidden="true"
          className="absolute bottom-3.5 right-3.5 z-10 h-11 w-11 rounded-full bg-background text-ink flex items-center justify-center shadow-sm transition-colors group-hover:bg-accent-primary-strong group-hover:text-white">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
      <div className="flex flex-1 flex-col px-1 pt-4">
        <h3 className="text-xl leading-tight text-ink group-hover:text-accent-primary-strong transition-colors">{product.name}</h3>
        <p className="text-sm text-ink/75 leading-snug mt-1.5">{product.tagline}</p>
        <div className="mt-auto pt-3 flex items-baseline justify-between gap-3">
          <span className="font-display text-2xl text-ink tabular-nums">
            {hasVariants && <span className="font-sans text-xs font-semibold text-ink/75 mr-1">od</span>}
            {formatPrice(product.minPrice)}
          </span>
          {hasVariants && <span className="text-xs font-medium text-accent-secondary-strong">{variantsNote}</span>}
        </div>
      </div>
    </Link>
  );
}
