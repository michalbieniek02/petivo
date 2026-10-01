import { AlertTriangle } from "lucide-react";

interface Props {
  handle: string;
  title: string;
}

/** General safety information shown on every product page (GPSR). Product-specific details are in the manufacturer's manual. */
export function ProductSafety({ handle, title }: Props) {
  const isFountain = /fontann/i.test(handle) || /fontann/i.test(title);
  const hasCamera = /kamer/i.test(handle) || /kamer/i.test(title);

  const common = [
    "Używaj urządzenia wyłącznie zgodnie z instrukcją producenta i zgodnie z jego przeznaczeniem.",
    "Zasilaj urządzenie wyłącznie zasilaczem lub ładowarką o parametrach podanych w instrukcji. Nie używaj uszkodzonego kabla, zasilacza ani wtyczki.",
    "Przed czyszczeniem odłącz urządzenie od zasilania. Nie zanurzaj w wodzie części elektrycznych, kabla ani wtyczki.",
    "Urządzenie nie jest zabawką. Nie pozostawiaj dzieci bez nadzoru w pobliżu urządzenia.",
    "Nie rozbieraj ani nie naprawiaj urządzenia samodzielnie. W razie uszkodzenia przestań go używać i skontaktuj się ze Sprzedawcą.",
  ];

  const specific = isFountain
    ? [
        "Nie uruchamiaj pompy bez wody. Regularnie uzupełniaj wodę i wymieniaj filtr zgodnie z instrukcją.",
        "Ustaw fontannę na stabilnej, suchej powierzchni, tak aby kabel nie był narażony na zalanie.",
      ]
    : [
        "Używaj wyłącznie suchej karmy o rozmiarze granulek wskazanym w opisie. Nie używaj do karmy mokrej.",
        "Jeżeli urządzenie umożliwia zasilanie bateryjne (np. awaryjne), stosuj baterie wskazane w instrukcji, nie mieszaj starych z nowymi i wyjmij je, gdy nie używasz urządzenia przez dłuższy czas. Zużyte baterie oddaj do punktu zbiórki.",
        "Karmnik nie zastępuje opieki nad zwierzęciem. Regularnie sprawdzaj, czy urządzenie działa i czy zwierzę ma dostęp do wody.",
      ];

  const camera = hasCamera
    ? [
        "Kamera rejestruje obraz i może rejestrować osoby. Używaj jej zgodnie z prawem i szanuj prywatność domowników i gości. Obraz z kamery przetwarza producent aplikacji; zapoznaj się z jej polityką prywatności.",
      ]
    : [];

  const items = [...common, ...specific, ...camera];

  return (
    <section aria-labelledby="safety-title" className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <h3 id="safety-title" className="flex items-center gap-2 text-base font-extrabold text-white">
        <AlertTriangle className="h-4 w-4 text-purple-300" aria-hidden="true" />
        Ostrzeżenia i bezpieczne użytkowanie
      </h3>
      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-white/70">
        {items.map((t) => (
          <li key={t} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" aria-hidden="true" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-white/55">
        To ogólne zasady bezpieczeństwa. Pełne ostrzeżenia, dane techniczne i instrukcja obsługi znajdują się w dokumentacji dołączonej do produktu.
      </p>
    </section>
  );
}
