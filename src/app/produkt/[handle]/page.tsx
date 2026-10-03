import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/products";
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
    openGraph: { title: product.name, description: product.tagline, images: product.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: PageProps<"/produkt/[handle]">) {
  const { handle } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.handle === handle);
  if (!product) notFound();

  return <ProductView product={product} others={products
        .filter((p) => p.handle !== handle)
        .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
        .slice(0, 4)} />;
}
