import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProducts, type Product } from "@/lib/products";
import { PITCH } from "@/lib/pitch";
import { ProductView } from "@/components/product-view";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: PageProps<"/produkt/[handle]">): Promise<Metadata> {
  const product = await getProduct((await params).handle);
  if (!product) return {};
  return {
    title: `${product.name} — ${product.tagline} | Petivo`,
    description: product.tagline,
    alternates: { canonical: `/produkt/${product.handle}` },
    openGraph: { type: "website", siteName: "Petivo", locale: "pl_PL", url: `/produkt/${product.handle}`, title: product.name, description: product.tagline, images: product.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: PageProps<"/produkt/[handle]">) {
  const { handle } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.handle === handle);
  if (!product) notFound();

  // products that complete the purchase first, then the rest of the same category
  const pairs = (PITCH[handle]?.pairs ?? []).map((h) => products.find((p) => p.handle === h)).filter((p): p is Product => !!p);
  const others = [...pairs, ...products
    .filter((p) => p.handle !== handle && !pairs.includes(p))
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))].slice(0, 4);

  const prices = product.variants.map((v) => v.price);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.tagline,
    image: product.images.slice(0, 4),
    url: `https://petivo.shop/produkt/${product.handle}`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "PLN",
      lowPrice: Math.min(...prices).toFixed(2),
      highPrice: Math.max(...prices).toFixed(2),
      offerCount: prices.length,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      url: `https://petivo.shop/produkt/${product.handle}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductView product={product} others={others} pairsCount={pairs.length} />
    </>
  );
}
