import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product, formatPrice } from "@/lib/products";

export function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const hasVariants = product.variants.length > 1;

  return (
    <Link href={`/produkt/${product.handle}`}
      className="group relative glass rounded-3xl p-5 h-full flex flex-col border border-white/[0.06] hover:border-purple-500/40 hover:bg-white/[0.06] transition-all duration-300">
      {featured && (
        <span className="absolute top-4 left-4 z-10 btn-primary text-[10px] px-3 py-1 rounded-full">Polecany</span>
      )}
      <div className="relative aspect-square rounded-2xl overflow-hidden mb-5 bg-white">
        <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
      </div>
      <h3 className="font-black text-white text-lg">{product.name}</h3>
      <p className="text-sm text-white/40 leading-snug mt-1 mb-5 flex-1">{product.tagline}</p>
      <div className="flex items-center justify-between">
        <div className="text-xl font-black text-gradient">
          {hasVariants && <span className="text-xs font-semibold text-white/40 mr-1">od</span>}
          {formatPrice(product.minPrice)}
        </div>
        <span className="inline-flex items-center gap-1 text-sm text-white/60 group-hover:text-white transition-colors">
          Zobacz <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
