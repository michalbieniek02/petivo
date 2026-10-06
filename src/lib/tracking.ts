/**
 * Consent-gated Meta pixel. Nothing loads and nothing is sent until the visitor accepts
 * advertising cookies in the banner; checkout events (Purchase) come from Shopify's
 * Facebook & Instagram channel, so the storefront only sends browse and cart events.
 */
export const META_PIXEL_ID = "1666997035145080";

const CONSENT_KEY = "petivo-consent";
export const CONSENT_OPEN_EVENT = "petivo:consent-open";
export const CONSENT_CHANGE_EVENT = "petivo:consent-change";

export type Consent = "granted" | "denied";

type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue?: unknown[][]; loaded?: boolean; version?: string; push?: unknown };
declare global {
  interface Window { fbq?: Fbq; _fbq?: Fbq }
}

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { value?: Consent };
    return parsed.value === "granted" || parsed.value === "denied" ? parsed.value : null;
  } catch {
    return null;
  }
}

export function saveConsent(value: Consent) {
  try {
    // the date documents when consent was given or refused
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ value, at: new Date().toISOString() }));
  } catch {}
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: value }));
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

/** Standard Meta snippet, run only after consent. */
export function loadPixel() {
  if (!META_PIXEL_ID || typeof window === "undefined" || window.fbq) return;
  const n: Fbq = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args);
    else n.queue!.push(args);
  } as Fbq;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  window.fbq = n;
  window._fbq = n;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  n("init", META_PIXEL_ID);
}

/** Sends a standard event when the pixel is active; a no-op without consent. */
export function track(event: "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout", data?: Record<string, unknown>) {
  if (!window.fbq || readConsent() !== "granted") return;
  const eventID = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  window.fbq("track", event, data ?? {}, { eventID });
}

/** Catalog item id used by Shopify's Facebook & Instagram channel. */
export function contentId(variantId: number) {
  return String(variantId);
}
