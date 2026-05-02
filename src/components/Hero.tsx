"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BadgeCheck,
  Clock,
  GraduationCap,
  MapPin,
  MessageCircle,
  Navigation,
  ReceiptText,
  School,
} from "lucide-react";
import { IconBadge } from "@/components/IconBadge";
import { SmartActionButton } from "@/components/SmartActionButton";
import { schoolInfo } from "@/data/school-info";
import { buildWhatsappMessage, buildWhatsappUrl } from "@/lib/whatsapp";

/* ─── Hero images carousel ─── */
const heroImages = [
  {
    src: "/images/school-exterior-hero-desktop.png",
    fallback: "/images/school-exterior-hero-desktop.png",
    alt: "مبنى روضة قناديل العلم في صحار",
    mobilePosition: "52% 42%",
    desktopPosition: "center 38%",
  },
  {
    src: "/images/kindergarten-hero.png",
    fallback: "/images/kindergarten-hero.png",
    alt: "بيئة التعلم في روضة قناديل العلم",
    mobilePosition: "48% 40%",
    desktopPosition: "center 36%",
  },
];

const heroStats = [
  { label: "الموقع", value: schoolInfo.address, icon: MapPin },
  { label: "الدوام", value: "٦:٣٠ – ١٢:٣٠", icon: Clock },
  { label: "الرسوم", value: schoolInfo.tuitionFees.amount, icon: ReceiptText },
  { label: "المراحل", value: "روضة وتمهيدي", icon: GraduationCap },
];

const SLIDE_INTERVAL = 6000;
const FADE_DURATION = 1200;

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [imageSrcs, setImageSrcs] = useState(() =>
    heroImages.map((img) => img.src),
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const whatsappMessage = buildWhatsappMessage({
    schoolName: schoolInfo.shortName,
    requestType: "استفسار",
    message: "أرغب بالتواصل مع إدارة الروضة.",
  });
  const whatsappUrl = buildWhatsappUrl(
    schoolInfo.whatsappInternational,
    whatsappMessage,
  );

  const nextSlide = useCallback(() => {
    setIsFading(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % heroImages.length);
      setIsFading(false);
    }, FADE_DURATION / 2);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(nextSlide, SLIDE_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextSlide]);

  /** Fallback: if the new hero image fails to load, use existing image */
  function handleImageError(index: number) {
    setImageSrcs((prev) => {
      const next = [...prev];
      next[index] = heroImages[index].fallback;
      return next;
    });
  }

  return (
    <section id="home" className="relative isolate overflow-hidden">
      {/* ════════════════════════════════════════════════════
          MOBILE HERO — immersive full-bleed background
         ════════════════════════════════════════════════════ */}
      <div className="relative lg:hidden" style={{ minHeight: "86svh" }}>
        {/* Background images with crossfade */}
        {heroImages.map((img, i) => (
          <div
            key={img.src}
            className="absolute inset-0 transition-opacity"
            style={{
              opacity: activeIndex === i ? (isFading ? 0.3 : 1) : 0,
              transitionDuration: `${FADE_DURATION}ms`,
              transitionTimingFunction: "ease-in-out",
            }}
          >
            <Image
              src={imageSrcs[i]}
              alt={img.alt}
              fill
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "low"}
              sizes="100vw"
              quality={85}
              className="object-cover"
              style={{ objectPosition: img.mobilePosition }}
              onError={() => handleImageError(i)}
            />
          </div>
        ))}

        {/* Overlay layers for readability — warm, not too dark */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f261e]/88 via-[#0f261e]/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17483A]/20 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute inset-x-0 top-0 z-10 px-4 pt-3">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-2.5 text-[0.68rem] font-extrabold text-white backdrop-blur-xl">
              <BadgeCheck className="size-3" aria-hidden="true" />
              الموقع الرسمي
            </span>
            <span className="inline-flex min-h-7 items-center rounded-full bg-white/12 px-2.5 text-[0.68rem] font-extrabold text-white backdrop-blur-xl">
              {schoolInfo.country}
            </span>
          </div>
        </div>

        {/* Content — positioned at bottom, integrated into hero */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-5">
          {/* Title */}
          <h1 className="text-[clamp(1.45rem,6.5vw,2.2rem)] font-extrabold leading-[1.32] tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
            {schoolInfo.heroTitle}
          </h1>

          {/* Description */}
          <p className="mt-2.5 max-w-sm text-[0.85rem] leading-[1.75] text-white/85">
            بيئة آمنة وحاضنة للأطفال في صحار / الجفرة.
          </p>

          {/* Quick info badges row */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {heroStats.map((stat) => (
              <span
                key={stat.label}
                className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[0.68rem] font-bold text-white/90 backdrop-blur-md"
              >
                <stat.icon
                  className="size-3 text-brand-warm"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                {stat.value}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="mt-4 grid gap-2">
            <SmartActionButton
              href={whatsappUrl}
              external
              icon={MessageCircle}
              variant="gold"
              className="min-h-[48px] justify-center text-[0.9rem]"
            >
              تواصل واتساب
            </SmartActionButton>
            <div className="grid grid-cols-2 gap-2">
              <SmartActionButton
                href={schoolInfo.mapUrl}
                external
                icon={Navigation}
                variant="glass"
                className="min-h-[44px] justify-center border-white/20 bg-white/12 text-sm text-white"
              >
                الخريطة
              </SmartActionButton>
              <SmartActionButton
                href="/admission"
                icon={School}
                variant="glass"
                className="min-h-[44px] justify-center border-white/20 bg-white/12 text-sm text-white"
              >
                التسجيل
              </SmartActionButton>
            </div>
          </div>

          {/* Slide indicators */}
          <div className="mt-3.5 flex justify-center gap-2">
            {heroImages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setActiveIndex(i);
                  if (timerRef.current) clearInterval(timerRef.current);
                  timerRef.current = setInterval(nextSlide, SLIDE_INTERVAL);
                }}
                className={`h-[3px] rounded-full transition-all duration-500 ${
                  activeIndex === i
                    ? "w-7 bg-brand-warm"
                    : "w-3.5 bg-white/35"
                }`}
                aria-label={`عرض الصورة ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          DESKTOP HERO — wide immersive full-bleed
         ════════════════════════════════════════════════════ */}
      <div className="relative hidden lg:block" style={{ minHeight: "780px" }}>
        {/* Background images with crossfade */}
        {heroImages.map((img, i) => (
          <div
            key={img.src}
            className="absolute inset-0 transition-opacity"
            style={{
              opacity: activeIndex === i ? (isFading ? 0.3 : 1) : 0,
              transitionDuration: `${FADE_DURATION}ms`,
              transitionTimingFunction: "ease-in-out",
            }}
          >
            <Image
              src={imageSrcs[i]}
              alt={img.alt}
              fill
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "low"}
              sizes="100vw"
              quality={90}
              className="object-cover"
              style={{ objectPosition: img.desktopPosition }}
              onError={() => handleImageError(i)}
            />
          </div>
        ))}

        {/* Desktop overlays — elegant gradient from right for RTL reading */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,38,30,0.05)_0%,rgba(15,38,30,0.12)_25%,rgba(15,38,30,0.65)_65%,rgba(15,38,30,0.85)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(15,38,30,0.70)_0%,rgba(15,38,30,0.20)_35%,rgba(15,38,30,0.02)_65%)]" />

        {/* Desktop content — right-aligned for RTL */}
        <div className="relative z-10 mx-auto flex min-h-[780px] max-w-7xl flex-col justify-end px-8 pb-16 pt-28">
          <div className="max-w-3xl text-right text-white">
            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-extrabold text-[#fbf4df] shadow-sm backdrop-blur-lg">
              <BadgeCheck className="size-4" aria-hidden="true" />
              الموقع الرسمي في {schoolInfo.country}
            </div>

            {/* Title */}
            <h1 className="text-[clamp(2.5rem,4.5vw,3.75rem)] font-extrabold leading-[1.18] tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              {schoolInfo.heroTitle}
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-2xl text-xl leading-10 text-[#fff8e9]/90 drop-shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
              {schoolInfo.heroDescription}
            </p>

            {/* Desktop buttons */}
            <div className="mt-7 flex flex-wrap gap-3">
              <SmartActionButton
                href={whatsappUrl}
                external
                icon={MessageCircle}
                variant="gold"
                className="min-w-44 text-base"
              >
                تواصل واتساب
              </SmartActionButton>
              <SmartActionButton
                href={schoolInfo.mapUrl}
                external
                icon={Navigation}
                variant="glass"
                className="border-white/30 bg-white/10 text-white hover:bg-white/18"
              >
                فتح الخريطة
              </SmartActionButton>
              <SmartActionButton
                href="/admission"
                icon={School}
                variant="glass"
                className="border-white/30 bg-white/10 text-white hover:bg-white/18"
              >
                بدء التسجيل
              </SmartActionButton>
            </div>

            {/* Slide indicators */}
            <div className="mt-5 flex gap-2">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setActiveIndex(i);
                    if (timerRef.current) clearInterval(timerRef.current);
                    timerRef.current = setInterval(nextSlide, SLIDE_INTERVAL);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    activeIndex === i
                      ? "w-10 bg-brand-warm"
                      : "w-5 bg-white/30 hover:bg-white/45"
                  }`}
                  aria-label={`عرض الصورة ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop stat cards */}
          <div className="mt-8 grid grid-cols-4 gap-3">
            {heroStats.map((item) => (
              <div
                key={item.label}
                className="group rounded-[1.75rem] border border-white/18 bg-white/10 p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/16"
              >
                <IconBadge icon={item.icon} tone="glass" size="md" />
                <p className="mt-4 text-xs font-extrabold text-[#f7ead0]">
                  {item.label}
                </p>
                <p className="mt-1 text-lg font-extrabold leading-7">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
