"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
  quote: string;
  author?: string;
};

export function ParallaxDivider({ src, alt, quote, author }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset]     = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        setIsVisible(e.isIntersecting);
        if (e.isIntersecting) setTextVisible(true);
      },
      { threshold: 0.15 },
    );
    obs.observe(el);

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const progress = (windowH - rect.top) / (windowH + rect.height);
      setOffset((Math.max(0, Math.min(1, progress)) * 60) - 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative h-[300px] overflow-hidden sm:h-[360px] lg:h-[440px]"
    >
      {/* Parallax image */}
      <div
        className="absolute inset-x-0 -bottom-16 -top-16"
        style={{ transform: `translateY(${offset}px)`, willChange: "transform" }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover object-center"
          loading="lazy"
        />
      </div>

      {/* Multi-layer overlay for cinematic depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-deep/30 via-brand-deep/70 to-brand-deep/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-deep/40 via-transparent to-brand-deep/40" />
      {/* Film grain texture */}
      <div className="absolute inset-0 mix-blend-overlay opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      {/* Edge lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-brand-warm/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-brand-warm/50 to-transparent" />

      {/* Quote */}
      <div
        className="relative flex h-full flex-col items-center justify-center px-6 text-center"
        style={{
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
          transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.1s",
        }}
      >
        {/* Ornament */}
        <div
          className="mb-4 text-[4rem] font-extrabold leading-none text-brand-warm/30 select-none"
          style={{ fontFamily: "Georgia, serif", lineHeight: 0.8 }}
        >
          ❝
        </div>

        <blockquote className="max-w-2xl text-[clamp(1.1rem,3.5vw,1.75rem)] font-extrabold leading-[1.55] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
          {quote}
        </blockquote>

        {author && (
          <div className="mt-5 flex items-center gap-3">
            <span className="h-px w-8 bg-brand-warm/40" />
            <cite className="text-sm font-bold not-italic text-brand-warm/70">
              {author}
            </cite>
            <span className="h-px w-8 bg-brand-warm/40" />
          </div>
        )}
      </div>
    </div>
  );
}
