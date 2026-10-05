/**
 * Sales copy per product: who it is for, benefits and what goes with it.
 * Every claim comes from the product description in Shopify; no health or performance promises.
 */
export interface Pitch {
  /** short name for tight spaces (cart suggestions, sets) */
  short: string;
  forWhom: string;
  benefits: string[];
  /** handles that complete the purchase, in order */
  pairs: string[];
}

export const PITCH: Record<string, Pitch> = {
  "legowisko-donut-puszyste": {
    short: "Legowisko donut",
    forWhom: "Dla kota lub psa, który śpi zwinięty w kłębek",
    benefits: [
      "Podwyższony brzeg, na którym pupil może oprzeć głowę",
      "Długie, miękkie włosie otula, także w chłodniejsze dni",
      "Cztery średnice od 40 do 70 cm, a do tego pięć kolorów pod wnętrze",
    ],
    pairs: ["mata-do-lizania-silikonowa", "mata-wechowa-dla-psa", "skladana-miska-podrozna"],
  },
  "legowisko-pianka-3d-zmywalna-poszewka": {
    short: "Legowisko z pianki 3D",
    forWhom: "Dla psa, który lubi spać wyciągnięty i nie lubi się zapadać",
    benefits: [
      "Równa, sprężysta pianka 3D zamiast zapadającego się wypełnienia",
      "Poszewkę zdejmiesz i wyczyścisz osobno",
      "Antypoślizgowy spód trzyma legowisko w miejscu, pasuje też do klatki",
    ],
    pairs: ["mata-wechowa-dla-psa", "mata-do-lizania-silikonowa", "pokrowiec-samochodowy-dla-psa"],
  },
  "legowisko-domek-dla-kota": {
    short: "Domek dla kota",
    forWhom: "Dla kota, który lubi się schować i mieć swój kąt",
    benefits: [
      "Półzamknięta konstrukcja daje kotu poczucie schronienia",
      "Miękkie, ciepłe wnętrze na jesień i wiosnę",
      "Dwa rozmiary: M 33 cm i XL 39–40 cm",
    ],
    pairs: ["drapak-tekturowy-dla-kota", "mata-do-lizania-silikonowa"],
  },
  "szelki-ze-smycza-dla-malego-psa": {
    short: "Szelki ze smyczą",
    forWhom: "Dla małego psa lub kota od 2 do 10 kg, na codzienne spacery",
    benefits: [
      "Szelki i smycz 1,5 m w jednym zestawie, bez dokupowania",
      "Odblaskowe elementy poprawiają widoczność po zmroku",
      "Regulowane paski i oddychający materiał, rozmiary XXS–L według wagi",
    ],
    pairs: ["skladana-miska-podrozna", "pokrowiec-samochodowy-dla-psa", "mata-wechowa-dla-psa"],
  },
  "pokrowiec-samochodowy-dla-psa": {
    short: "Pokrowiec do auta",
    forWhom: "Dla właściciela psa, który zabiera pupila samochodem",
    benefits: [
      "Chroni tylną kanapę przed sierścią, błotem i pazurami",
      "Wodoodporna tkanina Oxford, którą przetrzesz wilgotną ściereczką",
      "Regulowane paski przy zagłówkach, 145 × 135 cm, do aut osobowych i SUV-ów",
    ],
    pairs: ["szelki-ze-smycza-dla-malego-psa", "skladana-miska-podrozna"],
  },
  "mata-wechowa-dla-psa": {
    short: "Mata węchowa",
    forWhom: "Dla psa, który potrzebuje zajęcia w domu, np. w deszczowy dzień",
    benefits: [
      "Pies wywęszy smakołyki ukryte w paskach i kieszeniach",
      "Urozmaica posiłek, a Ty zyskujesz kilka spokojnych minut",
      "Materiałowa, do prania ręcznego",
    ],
    pairs: ["mata-do-lizania-silikonowa", "legowisko-pianka-3d-zmywalna-poszewka"],
  },
  "mata-do-lizania-silikonowa": {
    short: "Mata do lizania",
    forWhom: "Dla psa lub kota na kąpiel, obcinanie pazurów albo chwile samotności",
    benefits: [
      "Smakołyk rozsmarowany w rowkach pupil wylizuje powoli",
      "Przyssawki trzymają matę na kaflach, lodówce czy wannie",
      "Silikon, który umyjesz wodą z płynem do naczyń",
    ],
    pairs: ["mata-wechowa-dla-psa", "skladana-miska-podrozna"],
  },
  "drapak-tekturowy-dla-kota": {
    short: "Drapak tekturowy",
    forWhom: "Dla kota, który drapie kanapę zamiast drapaka",
    benefits: [
      "Miejsce do ostrzenia pazurów, a przy okazji do wylegiwania się",
      "Wytrzymała tektura falista o profilowanym kształcie",
      "Cztery modele, ok. 43 × 21 cm",
    ],
    pairs: ["legowisko-domek-dla-kota", "mata-do-lizania-silikonowa"],
  },
  "skladana-miska-podrozna": {
    short: "Składana miska",
    forWhom: "Na spacery, wycieczki i do samochodu",
    benefits: [
      "Składa się na płasko i mieści w kieszeni",
      "Karabińczyk do plecaka, smyczy lub paska",
      "Trzy pojemności: 350, 650 i 1000 ml",
    ],
    pairs: ["szelki-ze-smycza-dla-malego-psa", "pokrowiec-samochodowy-dla-psa"],
  },
};

/** Accessories that can be added to the cart in one tap (no size to choose). */
export const QUICK_ADD = ["mata-do-lizania-silikonowa", "skladana-miska-podrozna", "mata-wechowa-dla-psa", "drapak-tekturowy-dla-kota"];

/** Curated sets for the homepage. The first item is the one with a size to choose. */
export const SETS = [
  { title: "Koci kącik", desc: "Kryjówka do spania, coś do drapania i zajęcie na trudne chwile.", handles: ["legowisko-domek-dla-kota", "drapak-tekturowy-dla-kota", "mata-do-lizania-silikonowa"] },
  { title: "Spacer i podróż", desc: "Wszystko na wyjście z małym psem, łącznie z ochroną kanapy w aucie.", handles: ["szelki-ze-smycza-dla-malego-psa", "skladana-miska-podrozna", "pokrowiec-samochodowy-dla-psa"] },
  { title: "Spokojny wieczór z psem", desc: "Stabilne legowisko i dwie maty, przy których pies się zajmie.", handles: ["legowisko-pianka-3d-zmywalna-poszewka", "mata-wechowa-dla-psa", "mata-do-lizania-silikonowa"] },
];
