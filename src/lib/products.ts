const STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "ecxva5-gd.myshopify.com";

const ORDER = [
  "automatyczny-karmnik-z-kamera-hd-wifi",
  "karmnik-z-kamera-1080p-noktowizja",
  "karmnik-dla-dwoch-kotow-wifi",
  "automatyczny-karmnik-z-wyswietlaczem",
  "fontanna-dla-kota-stal-nierdzewna",
];

const CUTOUTS: Record<string, string> = {
  "automatyczny-karmnik-z-kamera-hd-wifi": "/products/karmnik-kamera-hd.webp",
  "karmnik-z-kamera-1080p-noktowizja": "/products/karmnik-kamera-1080p.webp",
  "karmnik-dla-dwoch-kotow-wifi": "/products/karmnik-dwa-koty.webp",
  "automatyczny-karmnik-z-wyswietlaczem": "/products/karmnik-wyswietlacz.webp",
  "fontanna-dla-kota-stal-nierdzewna": "/products/fontanna-stal.webp",
};

export interface Variant {
  id: number;
  title: string;
  price: number;
  compareAt: number | null;
  image: string | null;
}

export interface Product {
  handle: string;
  name: string;
  tagline: string;
  vendor: string;
  descriptionHtml: string;
  cutout: string | null;
  images: string[];
  optionName: string | null;
  variants: Variant[];
  minPrice: number;
}

interface RawProduct {
  handle: string;
  title: string;
  vendor: string;
  body_html: string;
  options: { name: string }[];
  images: { src: string }[];
  variants: {
    id: number;
    title: string;
    price: string;
    compare_at_price: string | null;
    featured_image: { src: string } | null;
  }[];
}

const CUTOUT_FILES = [
  "karmnik-kamera-hd",
  "karmnik-kamera-1080p",
  "karmnik-dwa-koty",
  "karmnik-wyswietlacz-bialy",
  "karmnik-wyswietlacz",
  "fontanna-stal",
];

// The cut-outs are also uploaded to Shopify (for checkout thumbnails); serve our local copy instead.
function localCutout(src: string): string | null {
  const file = new URL(src).pathname.split("/").pop() ?? "";
  const name = CUTOUT_FILES.find((n) => file.startsWith(`${n}.`) || file.startsWith(`${n}_`));
  return name ? `/products/${name}.webp` : null;
}

function toProduct(p: RawProduct): Product {
  const [name, ...rest] = p.title.split(" — ");
  const variants = p.variants.map((v) => ({
    id: v.id,
    title: v.title,
    price: parseFloat(v.price),
    compareAt: v.compare_at_price ? parseFloat(v.compare_at_price) : null,
    image: v.featured_image ? localCutout(v.featured_image.src) ?? v.featured_image.src : null,
  }));
  const hasOptions = !(variants.length === 1 && variants[0].title === "Default Title");
  return {
    handle: p.handle,
    name,
    tagline: rest.join(" — ").replace(/^./, (c) => c.toUpperCase()),
    vendor: p.vendor,
    descriptionHtml: p.body_html,
    cutout: CUTOUTS[p.handle] ?? null,
    images: p.images.map((i) => i.src).filter((src) => !localCutout(src)),
    optionName: hasOptions ? p.options[0]?.name ?? null : null,
    variants,
    minPrice: Math.min(...variants.map((v) => v.price)),
  };
}

export async function getProducts(): Promise<Product[]> {
  // Shopify rate-limits (429) bursts, which happens when many pages are prerendered at once; retry with backoff.
  let res: Response | undefined;
  for (let attempt = 0; attempt < 5; attempt++) {
    res = await fetch(`https://${STORE}/products.json?limit=250`, { next: { revalidate: 300 } });
    if (res.ok || (res.status !== 429 && res.status < 500)) break;
    await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
  }
  if (!res || !res.ok) throw new Error(`Shopify products.json: ${res?.status}`);
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
