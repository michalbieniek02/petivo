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

/** Background-free product shot on a warm sand backdrop with a soft floor shadow. */
export function ProductStage({ src, alt, sizes, priority, className = "", padding = "p-[12%]", radius = "rounded-[1.25rem]" }: Props) {
  return (
    <div className={`relative overflow-hidden ${radius} ${className}`}
      style={{ background: "radial-gradient(110% 85% at 50% 20%, #fbf6e6 0%, var(--sand) 70%)" }}>
      <div className="absolute left-1/2 bottom-[9%] -translate-x-1/2 w-3/5 h-[7%] rounded-[50%] bg-cocoa/25 blur-xl pointer-events-none" />
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority}
        className={`object-contain ${padding} drop-shadow-[0_18px_24px_rgba(94,64,23,0.25)] transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.03]`} />
    </div>
  );
}
