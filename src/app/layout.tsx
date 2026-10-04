import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { CartDrawer } from "@/components/cart-drawer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

// soft serif for headings: warm, homey, reads well in Polish
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  axes: ["SOFT", "opsz"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  themeColor: "#f7f2e2",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://petivo.shop"),
  title: "Petivo — legowiska, maty i akcesoria dla psa i kota",
  description:
    "Puszyste legowiska, szelki ze smyczą, pokrowiec do samochodu, maty do zabawy i drapak. Opisy po polsku i darmowa dostawa w Polsce od 200 zł.",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    title: "Petivo — legowiska i akcesoria dla pupili",
    description: "Legowiska, maty do zabawy i akcesoria na spacery dla psa i kota. Darmowa dostawa w Polsce od 200 zł.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Petivo — legowiska, maty i akcesoria dla psa i kota" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Petivo — legowiska i akcesoria dla pupili",
    description: "Legowiska, maty do zabawy i akcesoria na spacery dla psa i kota. Darmowa dostawa w Polsce od 200 zł.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
