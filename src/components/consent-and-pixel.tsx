"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CONSENT_OPEN_EVENT, META_PIXEL_ID, loadPixel, readConsent, saveConsent, track, type Consent } from "@/lib/tracking";

/** Cookie banner (accept and refuse equally easy) plus the consent-gated Meta pixel. */
export function ConsentAndPixel() {
  const [consent, setConsent] = useState<Consent | null | "loading">("loading");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const frame = requestAnimationFrame(() => setConsent(readConsent()));
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => { cancelAnimationFrame(frame); window.removeEventListener(CONSENT_OPEN_EVENT, reopen); };
  }, []);

  useEffect(() => {
    if (consent !== "granted") return;
    loadPixel();
    track("PageView");
  }, [consent, pathname]);

  // no pixel configured yet: nothing to ask about
  if (!META_PIXEL_ID) return null;

  const choose = (value: Consent) => {
    saveConsent(value);
    setConsent(value);
    setOpen(false);
    // withdrawing consent needs a fresh page so the already loaded pixel stops
    if (value === "denied" && window.fbq) window.location.reload();
  };

  if (consent === "loading" || (consent !== null && !open)) return null;

  return (
    <div role="dialog" aria-modal="false" aria-labelledby="consent-title"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-2xl border border-neutral-warm bg-card p-4 sm:p-5 shadow-[0_24px_60px_-24px_rgba(27,47,63,0.55)]">
      <p id="consent-title" className="font-semibold text-ink">Pliki cookie</p>
      <p className="mt-1.5 text-sm text-ink/80 leading-relaxed">
        Za Twoją zgodą używamy piksela Meta (Facebook, Instagram), żeby mierzyć skuteczność reklam i pokazywać je osobom zainteresowanym naszymi produktami.
        Sklep działa tak samo bez zgody. Zgodę możesz zmienić w stopce („Ustawienia cookies”).{" "}
        <Link href="/polityka-prywatnosci" className="underline underline-offset-2">Polityka prywatności</Link>
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button type="button" onClick={() => choose("denied")}
          className="min-h-11 rounded-full border border-ink/30 bg-card text-sm font-semibold text-ink hover:border-ink">Odrzucam</button>
        <button type="button" onClick={() => choose("granted")}
          className="min-h-11 rounded-full border border-ink/30 bg-card text-sm font-semibold text-ink hover:border-ink">Akceptuję</button>
      </div>
    </div>
  );
}

/** Footer link that reopens the banner; hidden until a pixel is configured. */
export function ConsentSettingsLink({ className = "" }: { className?: string }) {
  if (!META_PIXEL_ID) return null;
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))} className={className}>
      Ustawienia cookies
    </button>
  );
}
