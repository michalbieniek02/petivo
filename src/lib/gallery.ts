/**
 * Curated product galleries. Shopify images are matched by the start of their file name.
 *
 * - "cutout": white background removed (file in /public/products/gallery), shown on the dark stage
 * - "photo":  scene with its own background, fills the frame
 * - "card":   infographic or white-on-white product shot, shown as an inset card on the dark stage
 *
 * Order here is the gallery order. Images not listed are appended as "photo";
 * images listed with `hide` are duplicates of another slide.
 */
export type SlideKind = "cutout" | "photo" | "card";

interface Entry {
  key: string;
  kind: SlideKind;
  hide?: boolean;
}

const cut = (key: string): Entry => ({ key, kind: "cutout" });
const photo = (key: string): Entry => ({ key, kind: "photo" });
const card = (key: string): Entry => ({ key, kind: "card" });
const dup = (key: string): Entry => ({ key, kind: "photo", hide: true });

export const GALLERY: Record<string, Entry[]> = {
  "automatyczny-karmnik-z-kamera-hd-wifi": [
    cut("S5ed485c8135e478"),
    photo("Sba00ef6fac73407"),
    photo("Se6fd76bac370464"),
    photo("S8e9772ad47e4452"),
    photo("S24854007303f486"),
    photo("S491dd78a1a7747b"),
    photo("S139bf3d0eed0407"),
    card("S3a92ffb0d49545a"),
  ],
  "karmnik-z-kamera-1080p-noktowizja": [
    photo("S8dfe07a818af431"),
    photo("S49da00735bd345b"),
    photo("Sff278c642f214e3"),
    photo("S81f3920368784a8"),
    photo("S83c53cd628eb426"),
    card("Sc7804e3f5f5640d"),
    card("S91ecb5fd4123451"),
    dup("Sf9d99ddc5467461"),
  ],
  "karmnik-dla-dwoch-kotow-wifi": [
    photo("Scf116098c49c4cd"),
    photo("S47eb981142864eb"),
    photo("Sd5b9863a973a420"),
    photo("S6d18c32ec3cd4b5"),
    card("S7cf874d816cb437"),
    card("S21043f6260a049b"),
    card("Sd15282d50bff442"),
    dup("S33310d790a4443e"),
  ],
  "automatyczny-karmnik-z-wyswietlaczem": [
    cut("Sf047c19074e6499"),
    photo("S645e54ddcad3444"),
    photo("Sd25531c59092449"),
    photo("S0d678a1d4b0848b"),
    photo("S551251d3ca90435"),
    card("Sd3eeaab74a2b461"),
    dup("S1bfe18208d31454"),
    dup("S86d078875c1240a"),
  ],
  "fontanna-dla-kota-stal-nierdzewna": [
    photo("S22f3ff00399b465"),
    photo("S3849e6999896478"),
    photo("S53b9ac9d8f09475"),
    photo("S9df73fac36e24bc"),
    cut("Sdd40a9bc3f8849f"),
    cut("S67b193f118d3461"),
    cut("S46a26a3adeba47b"),
    cut("Sd3a91f77d0cd4fd"),
    card("Sa0b34f6795be4a6"),
    dup("Sd088473bdfc34ea"),
  ],
};

export interface Slide {
  src: string;
  kind: SlideKind;
  /** original Shopify URL, kept so variant images can be matched */
  shopifySrc: string | null;
  width: number;
  height: number;
}

function fileName(src: string) {
  return new URL(src).pathname.split("/").pop() ?? "";
}

function findEntry(handle: string, src: string) {
  const file = fileName(src);
  return GALLERY[handle]?.find((e) => file.startsWith(e.key));
}

/** Local cut-out for a Shopify image, if we made one. */
export function galleryCutout(handle: string, src: string): string | null {
  const e = findEntry(handle, src);
  return e?.kind === "cutout" ? `/products/gallery/${handle}-${e.key}.webp` : null;
}

export function buildGallery(handle: string, images: { src: string; width: number; height: number }[]): Slide[] {
  const entries = GALLERY[handle] ?? [];
  const rank = (src: string) => {
    const file = fileName(src);
    const i = entries.findIndex((e) => file.startsWith(e.key));
    return i === -1 ? entries.length : i;
  };
  return images
    .filter((img) => !findEntry(handle, img.src)?.hide)
    .sort((a, b) => rank(a.src) - rank(b.src))
    .map((img) => {
      const e = findEntry(handle, img.src);
      const kind = e?.kind ?? "photo";
      return {
        src: kind === "cutout" ? `/products/gallery/${handle}-${e!.key}.webp` : img.src,
        kind,
        shopifySrc: img.src,
        width: img.width,
        height: img.height,
      };
    });
}
