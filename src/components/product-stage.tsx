import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  padding?: string;
  radius?: string;
}

/** Background-free product shot on a warm tile with a soft floor shadow. */
export function ProductStage({ src, alt, sizes, priority, className = "", padding = "p-[12%]", radius = "rounded-[1.5rem]" }: Props) {
  return (
    <div className={`relative overflow-hidden ${radius} ${className}`}
      style={{ background: "radial-gradient(120% 90% at 50% 18%, #FFF9F7 0%, var(--sand) 72%)" }}>
      <div aria-hidden="true" className="absolute left-1/2 bottom-[10%] -translate-x-1/2 w-[62%] h-[7%] rounded-[50%] bg-ink/25 blur-xl pointer-events-none" />
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority}
        className={`object-contain ${padding} drop-shadow-[0_16px_18px_rgba(35,57,74,0.18)] transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.03]`} />
    </div>
  );
}
