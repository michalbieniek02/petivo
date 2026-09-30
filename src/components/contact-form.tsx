"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Check, Send } from "lucide-react";

const field =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-purple-400 focus:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          order: data.get("order"),
          message: data.get("message"),
          website: data.get("website"),
          consent: data.get("consent") === "on",
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Nie udało się wysłać wiadomości.");
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się wysłać wiadomości.");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="mt-8 rounded-2xl border border-purple-400/30 bg-purple-500/10 p-6 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }}>
          <Check className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        <p className="font-bold text-white">Dziękujemy, wiadomość wysłana.</p>
        <p className="mt-1 text-sm text-white/65">Odpowiemy na podany adres e-mail, zwykle w ciągu 2 dni roboczych.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
      <h3 className="text-lg font-extrabold text-white">Napisz do nas</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-white/70">
          Imię
          <input name="name" required maxLength={100} autoComplete="given-name" className={`${field} mt-1.5`} />
        </label>
        <label className="block text-sm text-white/70">
          E-mail
          <input name="email" type="email" required maxLength={200} autoComplete="email" className={`${field} mt-1.5`} />
        </label>
      </div>
      <label className="block text-sm text-white/70">
        Numer zamówienia <span className="text-white/40">(opcjonalnie)</span>
        <input name="order" maxLength={50} className={`${field} mt-1.5`} />
      </label>
      <label className="block text-sm text-white/70">
        Wiadomość
        <textarea name="message" required minLength={10} maxLength={3000} rows={6} className={`${field} mt-1.5 resize-y`} />
      </label>
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label>Nie wypełniaj tego pola<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <label className="flex items-start gap-3 text-xs leading-relaxed text-white/65">
        <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 shrink-0 accent-violet-500" />
        <span>
          Zgadzam się na przetworzenie moich danych w celu odpowiedzi na wiadomość, zgodnie z{" "}
          <Link href="/polityka-prywatnosci" className="underline underline-offset-4 hover:text-white">Polityką prywatności</Link>.
        </span>
      </label>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={status === "sending"}
        className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 px-6 py-3 text-sm disabled:opacity-60">
        {status === "sending" ? "Wysyłanie…" : <>Wyślij wiadomość <Send className="h-4 w-4" aria-hidden="true" /></>}
      </button>
    </form>
  );
}
