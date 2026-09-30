import data from "@/content/policies.json";

export type PolicyKey = keyof typeof data;

export const POLICIES: { slug: string; key: PolicyKey; title: string; description: string }[] = [
  { slug: "regulamin", key: "terms", title: "Regulamin", description: "Regulamin sklepu internetowego petivo.shop." },
  { slug: "zwroty-i-reklamacje", key: "refund", title: "Zwroty i reklamacje", description: "Odstąpienie od umowy w 14 dni i reklamacje." },
  { slug: "dostawa", key: "ship", title: "Dostawa", description: "Koszty i czas dostawy." },
  { slug: "polityka-prywatnosci", key: "priv", title: "Polityka prywatności", description: "Jak przetwarzamy dane osobowe." },
  { slug: "kontakt", key: "contact", title: "Kontakt", description: "Dane sprzedawcy i kontakt." },
];

export function policyHtml(key: PolicyKey) {
  return data[key];
}
