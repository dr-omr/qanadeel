"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   PILLAR DATA
   ═══════════════════════════════════════════════════════════ */
const pillars = [
  {
    title: "أمان مطلق",
    text: "بيئة مرخصة تحت إشراف وزارة التربية — كل تفصيلة مصممة لراحة بالك.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    accent: "bg-gradient-to-r from-emerald-500 to-teal-500",
    accentText: "text-emerald-500",
    iconBg: "bg-emerald-100 text-emerald-700 border border-emerald-200/60",
    title_color: "text-emerald-900",
    text_color: "text-emerald-700/70",
    glow: "rgba(16,185,129,0.15)",
    stat: { value: "١٠٠٪", label: "التزام بالسلامة" },
    features: ["كاميرات مراقبة ٢٤/٧", "طاقم مؤهل ومرخص"],
  },
  {
    title: "تعليم بالاكتشاف",
    text: "لا حفظ ولا تلقين — يتعلّم طفلك التفكير من خلال اللعب والتجربة الحقيقية.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
        <path d="M11 8v6" />
        <path d="M8 11h6" />
      </svg>
    ),
    bg: "bg-sky-50",
    border: "border-sky-100",
    accent: "bg-gradient-to-r from-sky-500 to-blue-500",
    accentText: "text-sky-500",
    iconBg: "bg-sky-100 text-sky-700 border border-sky-200/60",
    title_color: "text-sky-900",
    text_color: "text-sky-700/70",
    glow: "rgba(14,165,233,0.15)",
    stat: { value: "+١٠", label: "سنوات خبرة" },
    features: ["مناهج تفاعلية حديثة", "تقارير متابعة دورية"],
  },
  {
    title: "إبداع حر",
    text: "نحتفي بكل محاولة — الألوان والمسرح والحركة أدوات نمنحها لكل طفل.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    bg: "bg-amber-50",
    border: "border-amber-100",
    accent: "bg-gradient-to-r from-amber-500 to-orange-500",
    accentText: "text-amber-500",
    iconBg: "bg-amber-100 text-amber-700 border border-amber-200/60",
    title_color: "text-amber-900",
    text_color: "text-amber-700/70",
    glow: "rgba(245,158,11,0.15)",
    stat: { value: "٣", label: "مراحل تعليمية" },
    features: ["ركن فنون ومسرح", "أنشطة حركية يومية"],
  },
];

/* ═══════════════════════════════════════════════════════════
   PILLAR CARD
   ═══════════════════════════════════════════════════════════ */
function PillarCard({ pillar, index }: { pillar: (typeof pillars)[0]; index: number }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border p-5 transition-all duration-500 sm:rounded-[2rem] sm:p-7 ${pillar.bg} ${pillar.border}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.97)",
        transitionDelay: `${index * 120}ms`,
        transitionProperty: "opacity, transform, box-shadow",
        boxShadow: hovered
          ? `0 24px 60px ${pillar.glow}, 0 0 0 1px ${pillar.border}`
          : "0 4px 20px rgba(23,72,58,0.04)",
      }}
    >
      {/* Accent line at top */}
      <div className={`absolute inset-x-0 top-0 h-[3px] rounded-t-[2rem] ${pillar.accent} transition-all duration-300 ${hovered ? "opacity-100" : "opacity-60"}`} />

      {/* Glow blob on hover */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full blur-[72px] transition-opacity duration-500"
        style={{ background: pillar.glow, opacity: hovered ? 1 : 0 }}
      />

      {/* Decorative pattern — subtle dots */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-24 opacity-[0.035]" style={{
        backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
        backgroundSize: "8px 8px",
      }} />

      {/* Icon with pulse ring on hover */}
      <div className="relative mb-4 sm:mb-5">
        <div className={`relative z-10 flex size-12 items-center justify-center rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-transform duration-400 sm:size-14 sm:rounded-2xl group-hover:scale-110 group-hover:-rotate-3 ${pillar.iconBg}`}>
          {pillar.icon}
        </div>
        {/* Pulse ring */}
        <div
          className={`absolute inset-0 size-12 rounded-xl sm:size-14 sm:rounded-2xl ${pillar.accent} transition-all duration-500`}
          style={{
            opacity: hovered ? 0.15 : 0,
            transform: hovered ? "scale(1.35)" : "scale(1)",
          }}
        />
      </div>

      {/* Title */}
      <h3 className={`relative text-lg font-extrabold ${pillar.title_color}`}>{pillar.title}</h3>

      {/* Description */}
      <p className={`relative mt-2 text-[0.82rem] leading-7 sm:mt-3 sm:text-sm ${pillar.text_color}`}>{pillar.text}</p>

      {/* Feature mini-list — reveals more detail */}
      <div className="relative mt-3 space-y-1.5 sm:mt-4">
        {pillar.features.map((f) => (
          <div key={f} className="flex items-center gap-2">
            <span className={`flex size-4 shrink-0 items-center justify-center rounded-md ${pillar.accent}`}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </span>
            <span className={`text-[0.72rem] font-semibold sm:text-xs ${pillar.text_color}`}>{f}</span>
          </div>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Stat pill at bottom */}
      <div className={`relative mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 sm:mt-6 ${pillar.border} bg-white/80 backdrop-blur-sm`}>
        <span className={`h-1.5 w-1.5 rounded-full ${pillar.accent}`} />
        <span className={`text-xs font-extrabold ${pillar.title_color}`}>{pillar.stat.value}</span>
        <span className={`text-[0.65rem] font-bold ${pillar.text_color}`}>{pillar.stat.label}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MOBILE ACTIVE DOT TRACKER
   ═══════════════════════════════════════════════════════════ */
function MobileCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = el.scrollWidth / pillars.length;
    const idx = Math.round(el.scrollLeft / cardW);
    setActiveIdx(Math.min(idx, pillars.length - 1));
  }, []);

  return (
    <>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:hidden"
      >
        {pillars.map((p, i) => (
          <div key={p.title} className="w-[82vw] min-w-[82vw] snap-center">
            <PillarCard pillar={p} index={i} />
          </div>
        ))}
      </div>
      {/* Active dot indicator */}
      <div className="mt-4 flex items-center justify-center gap-2 sm:hidden">
        {pillars.map((p, i) => (
          <span
            key={i}
            className={`rounded-full transition-all duration-300 ${i === activeIdx
              ? `h-2 w-5 ${p.accent}`
              : "size-2 bg-brand-deep/15"
              }`}
          />
        ))}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   TRUST BAR
   ═══════════════════════════════════════════════════════════ */
const trustItems = [
  { icon: "🏛️", text: "مرخصة رسمياً" },
  { icon: "👨‍👩‍👧", text: "تواصل مباشر مع الأهل" },
  { icon: "📋", text: "سياسات واضحة ومعلنة" },
  { icon: "💚", text: "بيئة حاضنة وآمنة" },
];

/* ═══════════════════════════════════════════════════════════
   MAIN SECTION
   ═══════════════════════════════════════════════════════════ */
export function WhySection() {
  return (
    <section className="relative overflow-hidden bg-brand-ivory px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -left-48 top-10 size-96 rounded-full bg-emerald-100/50 blur-[100px]" />
      <div className="pointer-events-none absolute -right-48 bottom-10 size-96 rounded-full bg-amber-100/40 blur-[100px]" />

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-deep/12 bg-brand-deep/6 px-4 py-1.5 text-xs font-extrabold text-brand-deep">
            <span className="size-1.5 rounded-full bg-brand-deep" />
            لماذا قناديل العلم؟
          </span>
          <h2 className="mt-3 text-[clamp(1.4rem,5vw,2.5rem)] font-extrabold text-brand-deep sm:mt-4">
            ثلاثة ركائز نبني عليها
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[0.82rem] leading-7 text-brand-calm/70 sm:mt-3 sm:text-sm">
            أفضل تعليم مبكر يقوم على الأمان، والاكتشاف، والتعبير الحر.
          </p>
        </div>

        {/* Mobile: horizontal scroll with active dot */}
        <MobileCarousel />

        {/* Desktop: 3-column grid */}
        <div className="hidden gap-5 sm:grid sm:grid-cols-3">
          {pillars.map((p, i) => (
            <PillarCard key={p.title} pillar={p} index={i} />
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:mt-12">
          {trustItems.map((item) => (
            <div key={item.text} className="flex items-center gap-1.5">
              <span className="text-sm">{item.icon}</span>
              <span className="text-[0.7rem] font-bold text-brand-calm/50">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
