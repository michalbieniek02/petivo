import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";
import { POLICIES } from "@/lib/policies";

const BASE = "https://petivo.shop";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    ...products.map((p) => ({ url: `${BASE}/produkt/${p.handle}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...POLICIES.map((p) => ({ url: `${BASE}/${p.slug}`, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
