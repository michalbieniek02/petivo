import { AlertTriangle } from "lucide-react";

/** Product identifiers supplied by the manufacturer/marketplace listing (GPSR product identification). Add more as they are confirmed. */
const PRODUCT_IDS: Record<string, string> = {
  "legowisko-donut-puszyste": "1005006415813548-12000037090335942",
  "legowisko-pianka-3d-zmywalna-poszewka": "1005007554367777-12000041280664870",
  "legowisko-domek-dla-kota": "1005006967503445-12000038885667935",
  "mata-do-lizania-silikonowa": "1005007306665783-12000060794538137",
  "mata-wechowa-dla-psa": "1005007370484175-12000040464804596",
  "szelki-ze-smycza-dla-malego-psa": "1005008144996105-12000043981126637",
  "pokrowiec-samochodowy-dla-psa": "1005006860985075-12000038541930354",
  "drapak-tekturowy-dla-kota": "1005010285552258-12000051791873518",
  "skladana-miska-podrozna": "1005007413274233-12000040650733276",
};

interface Props {
  handle: string;
}

/** General safety information shown on every product page (GPSR). Product-specific details are on the product label or in the supplier's leaflet. */
export function ProductSafety({ handle }: Props) {
  const is = (re: RegExp) => re.test(handle);

  const common = [
    "Produkt nie jest zabawką dla dzieci. Przechowuj go poza zasięgiem małych dzieci.",
    "Przed użyciem sprawdź, czy produkt nie jest uszkodzony. W razie uszkodzenia przestań go używać i skontaktuj się ze Sprzedawcą.",
    "Nie zostawiaj zwierzęcia z produktem bez nadzoru, jeśli zwierzę gryzie lub połyka jego elementy.",
  ];

  const specific: string[] = [];
  if (is(/legowisk/)) {
    specific.push(
      "Nie stawiaj legowiska blisko grzejników, kominka ani innych źródeł ciepła i ognia.",
      "Rozmiar dobierz do pupila: zwierzę powinno swobodnie się w nim zmieścić. Wymiary mogą się różnić o 1–3 cm.",
      "Czyść legowisko regularnie. Zalecamy delikatne pranie ręczne i suszenie na powietrzu, chyba że opis produktu stanowi inaczej.",
    );
  }
  if (is(/szelki/)) {
    specific.push(
      "Dobierz rozmiar do obwodu klatki piersiowej i wagi pupila. Paski powinny przylegać, ale nie uciskać (zmieści się pod nimi palec).",
      "Szelki i smycz służą do spacerów pod nadzorem. Nie używaj ich do przywiązywania zwierzęcia i nie zostawiaj pupila w szelkach bez nadzoru.",
      "Odblaskowe elementy poprawiają widoczność, ale nie zastępują ostrożności w ruchu drogowym.",
    );
  }
  if (is(/pokrowiec/)) {
    specific.push(
      "Pokrowiec chroni tapicerkę, ale nie zastępuje pasów ani szelek bezpieczeństwa dla psa w samochodzie.",
      "Przed zakupem zmierz szerokość tylnej kanapy. Mocuj pokrowiec zgodnie z instrukcją i nie zasłaniaj nim pasów bezpieczeństwa dla pasażerów.",
    );
  }
  if (is(/mata-wechowa|mata-do-lizania/)) {
    specific.push(
      "Używaj maty pod nadzorem. Nie jest zabawką do gryzienia i nie powinna być połykana.",
      "Używaj tylko smakołyków i karmy odpowiednich dla Twojego zwierzęcia. Po użyciu umyj matę lub wypierz ją zgodnie z opisem.",
    );
  }
  if (is(/drapak/)) {
    specific.push(
      "Drapak z tektury z czasem się zużywa. Nie pozwalaj zwierzęciu zjadać kawałków kartonu i wymień drapak po zużyciu.",
    );
  }
  if (is(/miska/)) {
    specific.push(
      "Przed pierwszym użyciem umyj miskę. Nie zostawiaj napełnionej miski w nagrzanym samochodzie ani w pełnym słońcu.",
      "Miska nie jest zabawką do gryzienia. Nie podgrzewaj jej w kuchence mikrofalowej.",
    );
  }

  const items = [...specific, ...common];
  const productId = PRODUCT_IDS[handle];

  return (
    <section aria-labelledby="safety-title" className="mt-10 rounded-2xl border border-ink/15 bg-card p-5 sm:p-6">
      <h3 id="safety-title" className="flex items-center gap-2 text-lg text-ink">
        <AlertTriangle className="h-4 w-4 text-cocoa" aria-hidden="true" />
        Ostrzeżenia i bezpieczne użytkowanie
      </h3>
      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink/85">
        {items.map((t) => (
          <li key={t} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-camel" aria-hidden="true" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
      {productId && (
        <p className="mt-4 text-xs text-ink/80">
          <strong className="font-semibold text-ink">Identyfikator produktu:</strong> {productId}
        </p>
      )}
      <p className="mt-4 text-xs text-ink/75">
        To ogólne zasady bezpieczeństwa. Szczegółowe informacje o produkcie znajdziesz w jego opisie oraz na etykiecie lub w ulotce dołączonej do produktu.
      </p>
    </section>
  );
}
