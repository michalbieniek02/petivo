const STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "ecxva5-gd.myshopify.com";

const ORDER = [
  "petivo-auto-inteligentny-dozownik-karmy-dla-psa-i-kota-z-aplikacja",
  "petivo-vision-karmnik-z-kamera",
  "petivo-duo-karmnik-dla-dwoch-pupili",
  "petivo-basic-automatyczny-karmnik",
  "petivo-fresh-fontanna-dla-kota-i-psa",
];

export interface Variant {
  id: number;
  title: string;
  price: number;
  compareAt: number | null;
  available: boolean;
  image: string | null;
}

export interface Product {
  handle: string;
  name: string;
  tagline: string;
  descriptionHtml: string;
  images: string[];
  optionName: string | null;
  variants: Variant[];
  minPrice: number;
}

interface RawProduct {
  handle: string;
  title: string;
  body_html: string;
  options: { name: string }[];
  images: { src: string }[];
  variants: {
    id: number;
    title: string;
    price: string;
    compare_at_price: string | null;
    available: boolean;
    featured_image: { src: string } | null;
  }[];
}

function toProduct(p: RawProduct): Product {
  const [name, ...rest] = p.title.split(" — ");
  const variants = p.variants.map((v) => ({
    id: v.id,
    title: v.title,
    price: parseFloat(v.price),
    compareAt: v.compare_at_price ? parseFloat(v.compare_at_price) : null,
    available: v.available,
    image: v.featured_image?.src ?? null,
  }));
  const hasOptions = !(variants.length === 1 && variants[0].title === "Default Title");
  return {
    handle: p.handle,
    name,
    tagline: rest.join(" — "),
    descriptionHtml: p.body_html,
    images: p.images.map((i) => i.src),
    optionName: hasOptions ? p.options[0]?.name ?? null : null,
    variants,
    minPrice: Math.min(...variants.map((v) => v.price)),
  };
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`https://${STORE}/products.json?limit=250`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Shopify products.json: ${res.status}`);
  const { products } = (await res.json()) as { products: RawProduct[] };
  const rank = (h: string) => (ORDER.indexOf(h) === -1 ? ORDER.length : ORDER.indexOf(h));
  return products.map(toProduct).sort((a, b) => rank(a.handle) - rank(b.handle));
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.handle === handle);
}

export function formatPrice(value: number) {
  return `${value.toLocaleString("pl-PL", { minimumFractionDigits: value % 1 ? 2 : 0 })} zł`;
}
