import { getProducts } from "@/lib/products";
import { Landing } from "@/components/landing";

export const revalidate = 300;

export default async function Page() {
  return <Landing products={await getProducts()} />;
}
