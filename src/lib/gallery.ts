/**
 * Curated product galleries. Shopify images are matched by the start of their file name.
 *
 * - "cutout": white background removed (file in /public/products/gallery), shown on the dark stage
 * - "photo":  scene with its own background, fills the frame
 * - "card":   infographic or white-on-white product shot, shown as an inset card on the dark stage
 *
 * Order here is the gallery order. Images not listed are appended as "photo";
 * images listed with `hide` are duplicates of another slide or show a different model.
 * `pl`: a Polish version of the supplier graphic exists in /public/products/gallery/pl.
 */
export type SlideKind = "cutout" | "photo" | "card";

interface Entry {
  key: string;
  kind: SlideKind;
  hide?: boolean;
  pl?: boolean;
}

const cut = (key: string): Entry => ({ key, kind: "cutout" });
const photo = (key: string): Entry => ({ key, kind: "photo" });
const card = (key: string): Entry => ({ key, kind: "card" });
const photoPl = (key: string): Entry => ({ key, kind: "photo", pl: true });
const cardPl = (key: string): Entry => ({ key, kind: "card", pl: true });
const dup = (key: string): Entry => ({ key, kind: "photo", hide: true });

export const GALLERY: Record<string, Entry[]> = {
  "automatyczny-karmnik-z-kamera-hd-wifi": [
    cut("S5ed485c8135e478"),
    photoPl("Sba00ef6fac73407"),
    photoPl("Se6fd76bac370464"),
    photoPl("S8e9772ad47e4452"),
    photoPl("S24854007303f486"),
    photoPl("S491dd78a1a7747b"),
    photoPl("S139bf3d0eed0407"),
    cardPl("S3a92ffb0d49545a"),
  ],
  "karmnik-z-kamera-1080p-noktowizja": [
    photoPl("S8dfe07a818af431"),
    photoPl("S49da00735bd345b"),
    photoPl("Sff278c642f214e3"),
    photoPl("S81f3920368784a8"),
    photoPl("S83c53cd628eb426"),
    cardPl("Sc7804e3f5f5640d"),
    cardPl("S91ecb5fd4123451"),
    dup("Sf9d99ddc5467461"),
  ],
  "karmnik-dla-dwoch-kotow-wifi": [
    photoPl("Scf116098c49c4cd"),
    photo("S47eb981142864eb"),
    photoPl("Sd5b9863a973a420"),
    photoPl("S6d18c32ec3cd4b5"),
    cardPl("S7cf874d816cb437"),
    cardPl("S21043f6260a049b"),
    dup("Sd15282d50bff442"), // shows a single-bowl model, not this feeder
    dup("S33310d790a4443e"),
  ],
  "automatyczny-karmnik-z-wyswietlaczem": [
    cut("Sf047c19074e6499"),
    photo("S645e54ddcad3444"),
    photoPl("Sd25531c59092449"),
    photoPl("S0d678a1d4b0848b"),
    photoPl("S551251d3ca90435"),
    card("Sd3eeaab74a2b461"),
    dup("S1bfe18208d31454"),
    dup("S86d078875c1240a"),
  ],
  "fontanna-dla-kota-stal-nierdzewna": [
    photoPl("S22f3ff00399b465"),
    photoPl("S3849e6999896478"),
    photoPl("S53b9ac9d8f09475"),
    photoPl("S9df73fac36e24bc"),
    cut("Sdd40a9bc3f8849f"),
    cut("S67b193f118d3461"),
    cut("S46a26a3adeba47b"),
    cut("Sd3a91f77d0cd4fd"),
    cardPl("Sa0b34f6795be4a6"),
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
      const local = kind === "cutout"
        ? `/products/gallery/${handle}-${e!.key}.webp`
        : e?.pl ? `/products/gallery/pl/${handle}-${e.key}.webp` : null;
      return {
        src: local ?? img.src,
        kind,
        shopifySrc: img.src,
        width: img.width,
        height: img.height,
      };
    });
}
