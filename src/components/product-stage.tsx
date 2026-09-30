import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  padding?: string;
}

export function ProductStage({ src, alt, sizes, priority, className = "", padding = "p-[12%]" }: Props) {
  return (
    <div className={`relative overflow-hidden rounded-3xl ${className}`}
      style={{ background: "radial-gradient(120% 90% at 50% 15%, rgba(139,92,246,0.22) 0%, rgba(34,211,238,0.07) 45%, rgba(255,255,255,0.02) 75%)" }}>
      <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(255,255,255,0.04), transparent)" }} />
      <div className="absolute left-1/2 bottom-[8%] -translate-x-1/2 w-3/5 h-[8%] rounded-[50%] bg-black/70 blur-2xl pointer-events-none" />
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority}
        className={`object-contain ${padding} drop-shadow-[0_28px_36px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.03]`} />
    </div>
  );
}
