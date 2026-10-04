"use client";
import Image from "next/image";
import { useEffect, useRef, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SlideKind } from "@/lib/gallery";

export interface GallerySlide {
  src: string;
  kind: SlideKind;
  width: number;
  height: number;
}

const STAGE = "radial-gradient(110% 85% at 50% 20%, #FBF6EC 0%, var(--sand) 70%)";
const SIZES = "(max-width: 1024px) 100vw, 55vw";

function SlideView({ slide, alt, priority }: { slide: GallerySlide; alt: string; priority: boolean }) {
  const ratio = slide.width / slide.height;

  if (slide.kind === "cutout") {
    return (
      <>
        <div aria-hidden="true" className="absolute left-1/2 bottom-[9%] -translate-x-1/2 w-3/5 h-[7%] rounded-[50%] bg-ink/20 blur-xl" />
        <Image src={slide.src} alt={alt} fill priority={priority} sizes={SIZES}
          className="object-contain p-[11%] drop-shadow-[0_18px_24px_rgba(13,43,82,0.2)]" />
      </>
    );
  }

  if (slide.kind === "card") {
    // infographic / white-background shot: a lit card floating on the stage instead of a bare white square
    return (
      <div className="absolute inset-0 flex items-center justify-center p-[7%]">
        <div className="relative max-h-full max-w-full overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10 shadow-[0_24px_48px_-24px_rgba(27,54,68,0.45)]"
          style={{ aspectRatio: `${slide.width} / ${slide.height}`, height: ratio < 1 ? "100%" : undefined, width: ratio >= 1 ? "100%" : undefined }}>
          <Image src={slide.src} alt={alt} fill priority={priority} sizes={SIZES} className="object-contain" />
        </div>
      </div>
    );
  }

  // photo with its own background: square fills the frame, other ratios get a blurred fill behind
  if (ratio > 0.92 && ratio < 1.08) {
    return <Image src={slide.src} alt={alt} fill priority={priority} sizes={SIZES} className="object-cover" />;
  }
  return (
    <>
      <Image src={slide.src} alt="" aria-hidden="true" fill sizes="40vw" className="object-cover scale-110 blur-2xl opacity-50" />
      <Image src={slide.src} alt={alt} fill priority={priority} sizes={SIZES} className="object-contain" />
    </>
  );
}

function Thumb({ slide }: { slide: GallerySlide }) {
  if (slide.kind === "cutout") return <Image src={slide.src} alt="" fill sizes="80px" className="object-contain p-1.5" />;
  if (slide.kind === "card") {
    return (
      <span className="absolute inset-[14%] rounded-md overflow-hidden bg-white">
        <Image src={slide.src} alt="" fill sizes="64px" className="object-contain" />
      </span>
    );
  }
  return <Image src={slide.src} alt="" fill sizes="80px" className="object-cover" />;
}

interface Props {
  slides: GallerySlide[];
  name: string;
  index: number;
  onIndex: (i: number) => void;
}

export function ProductGallery({ slides, name, index, onIndex }: Props) {
  const thumbs = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<number | null>(null);
  const n = slides.length;
  const current = slides[index] ?? slides[0];
  const go = (d: number) => onIndex((index + d + n) % n);

  // keep the active thumbnail visible without scrolling the page
  useEffect(() => {
    const strip = thumbs.current;
    const el = strip?.children[index] as HTMLElement | undefined;
    if (!strip || !el) return;
    const left = el.offsetLeft - strip.offsetLeft;
    if (left < strip.scrollLeft || left + el.offsetWidth > strip.scrollLeft + strip.clientWidth) {
      strip.scrollTo({ left: left - strip.clientWidth / 2 + el.offsetWidth / 2, behavior: "smooth" });
    }
  }, [index]);

  const onPointerDown = (e: PointerEvent) => { if (e.pointerType !== "mouse") swipeStart.current = e.clientX; };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  };

  return (
    <div>
      <div className="relative aspect-square rounded-[1.75rem] overflow-hidden border border-neutral-warm/55 touch-pan-y select-none"
        style={{ background: STAGE }} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (swipeStart.current = null)}
        role="group" aria-roledescription="galeria" aria-label={`Zdjęcia produktu: ${index + 1} z ${n}`}>
        <div key={current.src} className="absolute inset-0 animate-in fade-in duration-300">
          <SlideView slide={current} alt={`${name} — zdjęcie ${index + 1} z ${n}`} priority={index === 0} />
        </div>
        {n > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Poprzednie zdjęcie"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full flex items-center justify-center bg-background/90 backdrop-blur border border-neutral-warm/55 text-ink shadow-sm hover:bg-ink hover:text-background transition-colors">
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Następne zdjęcie"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full flex items-center justify-center bg-background/90 backdrop-blur border border-neutral-warm/55 text-ink shadow-sm hover:bg-ink hover:text-background transition-colors">
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <span aria-hidden="true" className="absolute right-3 bottom-3 rounded-full bg-background/90 backdrop-blur border border-neutral-warm/55 px-2.5 py-1 text-xs font-semibold text-ink tabular-nums">
              {index + 1} / {n}
            </span>
          </>
        )}
      </div>

      {n > 1 && (
        <div ref={thumbs} className="flex gap-2.5 mt-2 py-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-1.5">
          {slides.map((s, i) => (
            <button key={s.src} type="button" onClick={() => onIndex(i)} aria-label={`Zdjęcie ${i + 1} z ${n}`} aria-pressed={i === index}
              className={`relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-[border-color,opacity] ${i === index ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"}`}
              style={{ background: STAGE }}>
              <Thumb slide={s} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
