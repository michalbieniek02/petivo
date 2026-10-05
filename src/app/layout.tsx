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
  themeColor: "#F8EEEA",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://petivo.shop"),
  applicationName: "Petivo",
  title: { default: "Petivo — legowiska, maty i akcesoria dla psa i kota", template: "%s" },
  keywords: ["legowisko dla psa", "legowisko dla kota", "szelki dla psa", "mata węchowa", "mata do lizania", "pokrowiec na fotel samochodowy dla psa", "drapak dla kota", "akcesoria dla zwierząt"],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  description:
    "Puszyste legowiska, szelki ze smyczą, pokrowiec do samochodu, maty do zabawy i drapak. Opisy po polsku i darmowa dostawa w Polsce od 200 zł.",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "Petivo",
    url: "/",
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

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://petivo.shop/#org",
      name: "Petivo",
      url: "https://petivo.shop",
      logo: "https://petivo.shop/icon.png",
      email: "kontakt@petivo.shop",
      areaServed: "PL",
    },
    {
      "@type": "WebSite",
      "@id": "https://petivo.shop/#site",
      name: "Petivo",
      alternateName: "Petivo — legowiska i akcesoria dla psa i kota",
      url: "https://petivo.shop",
      inLanguage: "pl-PL",
      publisher: { "@id": "https://petivo.shop/#org" },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
