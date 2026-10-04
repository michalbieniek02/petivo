"use client";
import { useMemo, useState } from "react";
import { ProductCard } from "./product-card";
import { Reveal } from "./scroll-reveal";
import { CATEGORIES, type CategoryId } from "@/lib/categories";
import type { Product } from "@/lib/products";

export type Filter = "all" | CategoryId;
type Sort = "featured" | "asc" | "desc";

interface Props {
  products: Product[];
  /** controlled category (e.g. set by the category tiles above the grid) */
  category?: Filter;
  onCategory?: (c: Filter) => void;
}

export function ProductGrid({ products, category: controlled, onCategory }: Props) {
  const [own, setOwn] = useState<Filter>("all");
  const category = controlled ?? own;
  const setCategory = onCategory ?? setOwn;
  const [sort, setSort] = useState<Sort>("featured");

  // Only categories that actually have products get a filter button.
  const filters = useMemo(() => {
    const present = CATEGORIES.map((c) => ({ id: c.id as Filter, label: c.label, count: products.filter((p) => p.category === c.id).length }))
      .filter((c) => c.count > 0);
    return [{ id: "all" as Filter, label: "Wszystkie", count: products.length }, ...present];
  }, [products]);

  const visible = useMemo(() => {
    const list = category === "all" ? [...products] : products.filter((p) => p.category === category);
    if (sort === "asc") list.sort((a, b) => a.minPrice - b.minPrice);
    if (sort === "desc") list.sort((a, b) => b.minPrice - a.minPrice);
    return list;
  }, [products, category, sort]);

  // The wide "featured" card only makes sense for the default view.
  const showFeatured = category === "all" && sort === "featured";

  return (
    <>
      <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {filters.length > 2 && (
          <div role="group" aria-label="Kategorie produktów" className="-mx-4 px-4 sm:mx-0 sm:px-1.5 py-1.5 -my-1.5 flex gap-2 overflow-x-auto no-scrollbar">
            {filters.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={category === c.id}
                onClick={() => setCategory(c.id)}
                className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors ${
                  category === c.id
                    ? "border-ink bg-ink text-background"
                    : "border-neutral-warm/80 bg-card text-ink/85 hover:border-ink/40 hover:text-ink"
                }`}
              >
                {c.label} <span className={`ml-1 tabular-nums ${category === c.id ? "text-neutral-warm" : "text-ink/75"}`}>{c.count}</span>
              </button>
            ))}
          </div>
        )}
        <label className="flex items-center gap-3 text-sm text-ink/80 sm:ml-auto">
          Sortuj
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="min-h-11 rounded-full border border-neutral-warm/80 bg-card px-4 text-sm text-ink focus:border-ink focus:outline-none"
          >
            <option value="featured">Polecane</option>
            <option value="asc">Cena rosnąco</option>
            <option value="desc">Cena malejąco</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {visible.map((p, i) => {
          const featured = showFeatured && i === 0;
          return (
            <Reveal key={p.handle} delay={Math.min(i, 4) * 0.05} className={featured ? "h-full sm:col-span-2" : "h-full"}>
              <ProductCard product={p} featured={featured} />
            </Reveal>
          );
        })}
      </div>
    </>
  );
}
