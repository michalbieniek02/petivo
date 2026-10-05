"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";
import { ProductStage } from "./product-stage";

type Pet = "pies" | "kot";
type Sleep = "klebek" | "wyciagniety" | "chowa";
interface Pick { handle: string; size: string; why: string }

const DONUT = "legowisko-donut-puszyste";
const FOAM = "legowisko-pianka-3d-zmywalna-poszewka";
const HOUSE = "legowisko-domek-dla-kota";

/** Size steps per bed. Weights for the foam bed come from the producer; the rest follow the "a few cm bigger" rule from the descriptions. */
const SIZES: Record<Sleep, { label: string; handle: string; size: string }[]> = {
  klebek: [
    { label: "do ok. 30 cm", handle: DONUT, size: "40 cm" },
    { label: "30–40 cm", handle: DONUT, size: "50 cm" },
    { label: "40–50 cm", handle: DONUT, size: "60 cm" },
    { label: "50–60 cm", handle: DONUT, size: "70 cm" },
  ],
  wyciagniety: [
    { label: "do 7 kg", handle: FOAM, size: "M 58 × 40 cm" },
    { label: "7–15 kg", handle: FOAM, size: "L 73 × 46 cm" },
    { label: "15–25 kg", handle: FOAM, size: "XL 90 × 58 cm" },
    { label: "25–45 kg", handle: FOAM, size: "XXL 105 × 65 cm" },
  ],
  chowa: [
    { label: "do ok. 25 cm", handle: HOUSE, size: "M 33 × 33 × 33 cm" },
    { label: "powyżej 25 cm", handle: HOUSE, size: "XL 39 × 39 × 40 cm" },
  ],
};

const SIZE_QUESTION: Record<Sleep, string> = {
  klebek: "Ile mierzy pupil zwinięty w kłębek?",
  wyciagniety: "Ile waży pupil?",
  chowa: "Ile mierzy kot zwinięty w kłębek?",
};

const WHY: Record<Sleep, string> = {
  klebek: "Okrągły donut z podwyższonym brzegiem pasuje do pupila, który śpi zwinięty i lubi oprzeć głowę.",
  wyciagniety: "Płaskie legowisko z pianki 3D daje miejsce, żeby się wyciągnąć, i nie zapada się pod ciężarem.",
  chowa: "Półzamknięty domek daje kotu kryjówkę, w której czuje się bezpiecznie.",
};

function Choice({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="min-h-12 rounded-2xl border border-neutral-warm/80 bg-card px-4 py-3 text-left text-sm font-medium text-ink hover:border-accent-primary-strong hover:bg-accent-primary/10 transition-colors">
      {children}
    </button>
  );
}

export function BedQuiz({ products }: { products: Product[] }) {
  const [pet, setPet] = useState<Pet | null>(null);
  const [sleep, setSleep] = useState<Sleep | null>(null);
  const [pick, setPick] = useState<Pick | null>(null);
  const reset = () => { setPet(null); setSleep(null); setPick(null); };

  const step = pick ? 4 : sleep ? 3 : pet ? 2 : 1;
  const product = pick ? products.find((p) => p.handle === pick.handle) : undefined;
  const sizeIdx = product?.options.findIndex((o) => o.values.includes(pick!.size)) ?? -1;
  const price = product && sizeIdx >= 0
    ? Math.min(...product.variants.filter((v) => v.options[sizeIdx] === pick!.size).map((v) => v.price))
    : product?.minPrice;

  const choose = (s: Sleep) => {
    setSleep(s);
    // cats that sleep stretched out fit the smallest foam bed, no second question needed
    if (s === "wyciagniety" && pet === "kot") setPick({ handle: FOAM, size: "M 58 × 40 cm", why: WHY.wyciagniety });
  };

  return (
    <div className="rounded-[2rem] bg-card border border-neutral-warm/60 p-5 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-primary-strong">Dobór w 30 sekund · krok {Math.min(step, 3)} z 3</p>
        {step > 1 && (
          <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-xs font-medium text-ink/75 hover:text-ink">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Od nowa
          </button>
        )}
      </div>

      <div aria-live="polite" className="mt-4">
        {step === 1 && (
          <>
            <p className="font-display text-2xl text-ink">Dla kogo szukasz legowiska?</p>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <Choice onClick={() => setPet("pies")}>Dla psa</Choice>
              <Choice onClick={() => setPet("kot")}>Dla kota</Choice>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="font-display text-2xl text-ink">Jak najczęściej śpi?</p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
              <Choice onClick={() => choose("klebek")}>Zwinięty w kłębek</Choice>
              <Choice onClick={() => choose("wyciagniety")}>Wyciągnięty</Choice>
              {pet === "kot" && <Choice onClick={() => choose("chowa")}>Lubi się chować</Choice>}
            </div>
          </>
        )}

        {step === 3 && sleep && (
          <>
            <p className="font-display text-2xl text-ink">{SIZE_QUESTION[sleep]}</p>
            {sleep !== "wyciagniety" && <p className="text-sm text-ink/75 mt-1">Zmierz średnicę, jaką zajmuje, gdy śpi. Wystarczy w przybliżeniu.</p>}
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {SIZES[sleep].map((o) => (
                <Choice key={o.label} onClick={() => setPick({ handle: o.handle, size: o.size, why: WHY[sleep] })}>{o.label}</Choice>
              ))}
            </div>
          </>
        )}

        {step === 4 && pick && product && (
          <div className="grid gap-5 sm:grid-cols-[13rem_1fr] sm:items-center">
            {product.packshot && <ProductStage src={product.packshot} alt={product.name} className="aspect-[4/3]" radius="rounded-2xl" sizes="13rem" padding="p-[8%]" />}
            <div>
              <p className="text-sm text-ink/75">Najlepszy wybór dla Twojego pupila</p>
              <p className="font-display text-2xl sm:text-3xl text-ink leading-tight mt-1">{product.name}</p>
              <p className="mt-2 text-sm font-semibold text-accent-secondary-strong">Rozmiar: {pick.size}</p>
              <p className="mt-2 text-sm text-ink/80 leading-relaxed">{pick.why} Jeśli pupil jest na granicy rozmiarów, wybierz większy.</p>
              <Link href={`/produkt/${product.handle}?rozmiar=${encodeURIComponent(pick.size)}`}
                className="btn-primary min-h-12 px-6 mt-5 inline-flex items-center justify-center gap-2 text-sm w-full min-[400px]:w-auto">
                Zobacz w rozmiarze {/^\d/.test(pick.size) ? pick.size : pick.size.split(" ")[0]} · {price !== undefined && formatPrice(price)} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
