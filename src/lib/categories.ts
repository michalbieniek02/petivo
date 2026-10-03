/**
 * Product categories. A product is assigned by its Shopify product type first, then by its name.
 * To add a category, add an entry here and set the matching product type in Shopify.
 * Categories without products are never shown.
 */
export const CATEGORIES = [
  { id: "karmniki", label: "Karmniki", singular: "Karmnik", types: ["Dozowniki karmy dla zwierząt"], name: /karmnik|dozownik/i },
  { id: "fontanny", label: "Fontanny", singular: "Fontanna", types: ["Fontanny dla zwierząt"], name: /fontann|poidł/i },
  { id: "filtry", label: "Filtry", singular: "Filtry", types: ["Filtry do fontann"], name: /^filtr/i },
  { id: "akcesoria", label: "Akcesoria", singular: "Akcesoria", types: ["Akcesoria dla zwierząt"], name: /^$/ },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

const FALLBACK: CategoryId = "akcesoria";

export function categoryOf(productType: string, name: string): CategoryId {
  const byType = CATEGORIES.find((c) => (c.types as readonly string[]).includes(productType));
  if (byType) return byType.id;
  return CATEGORIES.find((c) => c.name.test(name))?.id ?? FALLBACK;
}

export function categoryById(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id)!;
}
