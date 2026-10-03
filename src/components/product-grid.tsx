"use client";
import { useMemo, useState } from "react";
import { ProductCard } from "./product-card";
import { Reveal } from "./scroll-reveal";
import type { Product } from "@/lib/products";

type Category = "all" | "karmniki" | "fontanny";
type Sort = "featured" | "asc" | "desc";

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all", label: "Wszystkie" },
  { id: "karmniki", label: "Karmniki" },
  { id: "fontanny", label: "Fontanny" },
];

function categoryOf(p: Product): Exclude<Category, "all"> {
  return /fontann/i.test(p.handle) || /fontann/i.test(p.name) ? "fontanny" : "karmniki";
}

export function ProductGrid({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<Category>("all");
  const [sort, setSort] = useState<Sort>("featured");

  const counts = useMemo(() => {
    const c: Record<Category, number> = { all: products.length, karmniki: 0, fontanny: 0 };
    for (const p of products) c[categoryOf(p)]++;
    return c;
  }, [products]);

  const visible = useMemo(() => {
    const list = category === "all" ? [...products] : products.filter((p) => categoryOf(p) === category);
    if (sort === "asc") list.sort((a, b) => a.minPrice - b.minPrice);
    if (sort === "desc") list.sort((a, b) => b.minPrice - a.minPrice);
    return list;
  }, [products, category, sort]);

  // The wide "featured" card only makes sense for the default view.
  const showFeatured = category === "all" && sort === "featured";

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Kategorie produktów" className="flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => c.id === "all" || counts[c.id] > 0).map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={category === c.id}
              onClick={() => setCategory(c.id)}
              className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors ${
                category === c.id
                  ? "border-purple-400 bg-purple-500/20 text-white"
                  : "border-white/10 text-white/65 hover:border-white/30 hover:text-white"
              }`}
            >
              {c.label} <span className="ml-1 text-white/50">{counts[c.id]}</span>
            </button>
          ))}
        </div>
        <label className="flex items-center gap-3 text-sm text-white/65">
          Sortuj
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="min-h-11 rounded-full border border-white/10 bg-[#0e0e1a] px-4 text-sm text-white focus:border-purple-400 focus:outline-none"
          >
            <option value="featured">Polecane</option>
            <option value="asc">Cena rosnąco</option>
            <option value="desc">Cena malejąco</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {visible.map((p, i) => {
          const featured = showFeatured && i === 0;
          return (
            <Reveal key={p.handle} delay={i * 0.05} className={featured ? "h-full sm:col-span-2" : "h-full"}>
              <ProductCard product={p} featured={featured} />
            </Reveal>
          );
        })}
      </div>
    </>
  );
}
