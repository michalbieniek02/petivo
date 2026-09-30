import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { CartDrawer } from "@/components/cart-drawer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://petivo.shop"),
  title: "Petivo — automatyczne karmniki i fontanny dla kota i psa",
  description:
    "Karmniki z kamerą i aplikacją, karmnik dla dwóch kotów i fontanna ze stali nierdzewnej. Darmowa dostawa w Polsce od 200 zł.",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    title: "Petivo — karmniki i fontanny dla pupili",
    description: "Karmniki z kamerą i aplikacją oraz fontanna dla kota. Steruj karmieniem z telefonu.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Petivo — karmniki z kamerą i fontanny dla kota i psa" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Petivo — karmniki i fontanny dla pupili",
    description: "Karmniki z kamerą i aplikacją oraz fontanna dla kota. Steruj karmieniem z telefonu.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={inter.variable}>
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
