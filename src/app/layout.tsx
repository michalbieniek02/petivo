import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Petivo Auto — Inteligentny Karmnik dla Psa i Kota",
  description:
    "Nigdy więcej spóźnionych posiłków. Steruj z aplikacji, gdziekolwiek jesteś.",
  openGraph: {
    title: "Petivo Auto",
    description: "Zadbaj o pupila zdalnie. WiFi + Aplikacja + Precyzyjne porcje.",
    images: [
      "https://cdn.shopify.com/s/files/1/1020/7222/2070/files/S5ed485c8135e4785821a1f551c7ce25cQ.webp",
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
