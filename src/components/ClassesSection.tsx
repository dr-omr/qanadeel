"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { schoolInfo } from "@/data/school-info";

/* ═══════════════════════════════════════════════════════════
   STAGE CARD DATA
   ═══════════════════════════════════════════════════════════ */
const stages = [
  {
    stage: "روضة",
    count: schoolInfo.classes[0]?.count ?? "٢",
    notes: schoolInfo.classes[0]?.notes ?? "",
    ageRange: "٤ – ٥ سنوات",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22c6 0 8-3 8-10V5l-8-3-8 3v7c0 7 2 10 8 10z" />
        <path d="M12 8v4" /><circle cx="12" cy="16" r="1" />
      </svg>
    ),
    color: "emerald",
    gradient: "from-emerald-500 to-teal-600",
    lightBg: "bg-emerald-50",
    lightBorder: "border-emerald-100",
    lightText: "text-emerald-700",
    glow: "rgba(16,185,129,0.18)",
    features: ["تعلم بالاكتشاف واللعب", "تنمية المهارات الحركية", "تعزيز الثقة بالنفس"],
    highlight: { emoji: "🛡️", text: "بيئة آمنة ومرخصة" },
  },
  {
    stage: "تمهيدي",
    count: schoolInfo.classes[1]?.count ?? "٢",
    notes: schoolInfo.classes[1]?.notes ?? "",
    ageRange: "٥ – ٦ سنوات",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
      </svg>
    ),
    color: "sky",
    gradient: "from-sky-500 to-blue-600",
    lightBg: "bg-sky-50",
    lightBorder: "border-sky-100",
    lightText: "text-sky-700",
    glow: "rgba(14,165,233,0.18)",
    features: ["تهيئة للمرحلة الابتدائية", "مهارات القراءة والكتابة", "تنمية التفكير المنطقي"],
    highlight: { emoji: "🎓", text: "استعداد أكاديمي كامل" },
  },
];

/* ═══════════════════════════════════════════════════════════
   ANIMATED STAT
   ═══════════════════════════════════════════════════════════ */
function AnimatedStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-1.5 text-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.95)",
        transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      <span className="text-3xl font-extrabold text-brand-deep sm:text-4xl">{value}</span>
      <span className="text-xs font-bold text-brand-calm/70">{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STAGE CARD
   ═══════════════════════════════════════════════════════════ */
function StageCard({ stage, index }: { stage: typeof stages[0]; index: number }) {
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
      className={`group relative overflow-hidden rounded-[1.75rem] border p-5 sm:rounded-[2rem] sm:p-8 ${stage.lightBg} ${stage.lightBorder}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.97)",
        transitionProperty: "opacity, transform, box-shadow",
        transitionDuration: "0.6s",
        transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
        transitionDelay: `${index * 150}ms`,
        boxShadow: hovered
          ? `0 24px 60px ${stage.glow}, 0 0 0 1px ${stage.lightBorder}`
          : "0 4px 20px rgba(23,72,58,0.04)",
      }}
    >
      {/* Accent top bar */}
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${stage.gradient} rounded-t-[2rem] ${hovered ? "opacity-100" : "opacity-60"} transition-opacity duration-300`} />

      {/* Glow blob */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full blur-[72px] transition-opacity duration-500"
        style={{ background: stage.glow, opacity: hovered ? 1 : 0 }}
      />

      {/* Decorative dot pattern */}
      <div className="pointer-events-none absolute bottom-0 left-0 size-20 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
        backgroundSize: "8px 8px",
      }} />

      {/* Top row: Icon + badges */}
      <div className="relative flex items-start justify-between">
        <div className="relative">
          <div className={`relative z-10 flex size-13 items-center justify-center rounded-xl sm:size-16 sm:rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-transform duration-400 group-hover:scale-110 group-hover:-rotate-3 ${stage.lightBg} ${stage.lightText} border ${stage.lightBorder}`}>
            {stage.icon}
          </div>
          {/* Pulse ring */}
          <div
            className={`absolute inset-0 size-13 rounded-xl sm:size-16 sm:rounded-2xl ${stage.lightBg} transition-all duration-500`}
            style={{ opacity: hovered ? 0.6 : 0, transform: hovered ? "scale(1.3)" : "scale(1)" }}
          />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] font-extrabold ${stage.lightBorder} ${stage.lightText} bg-white/80`}>
            <span className={`size-1.5 rounded-full bg-gradient-to-r ${stage.gradient}`} />
            {stage.count} صفوف
          </span>
          <span className={`rounded-full bg-white/60 border ${stage.lightBorder} px-2.5 py-0.5 text-[0.6rem] font-bold ${stage.lightText}`}>
            {stage.ageRange}
          </span>
        </div>
      </div>

      {/* Title + description */}
      <h3 className={`relative mt-5 text-2xl font-extrabold ${stage.lightText.replace("700", "900")}`}>
        {stage.stage}
      </h3>
      <p className={`relative mt-2 text-sm leading-7 ${stage.lightText} opacity-70`}>
        {stage.notes}
      </p>

      {/* Features list */}
      <ul className="relative mt-5 space-y-2.5">
        {stage.features.map((f) => (
          <li key={f} className="flex items-center gap-2.5">
            <span className={`flex size-5 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${stage.gradient}`}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </span>
            <span className={`text-sm font-semibold ${stage.lightText}`}>{f}</span>
          </li>
        ))}
      </ul>

      {/* Highlight stat bar */}
      <div className={`relative mt-5 flex items-center gap-2.5 rounded-xl border px-3.5 py-2 ${stage.lightBorder} bg-white/60 backdrop-blur-sm`}>
        <span className="text-base">{stage.highlight.emoji}</span>
        <span className={`text-[0.75rem] font-bold ${stage.lightText}`}>{stage.highlight.text}</span>
      </div>

      {/* CTA */}
      <Link
        href="/admission"
        className={`group/btn relative mt-5 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r ${stage.gradient} px-6 py-3.5 text-[0.9rem] font-extrabold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.97] sm:py-3 sm:text-sm`}
      >
        سجّل في {stage.stage}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" className="transition-transform duration-300 group-hover/btn:-translate-x-1">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </Link>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MOBILE CAROUSEL — with active dot tracker
   ═══════════════════════════════════════════════════════════ */
function MobileCardCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = el.scrollWidth / stages.length;
    const idx = Math.round(el.scrollLeft / cardW);
    setActiveIdx(Math.min(idx, stages.length - 1));
  }, []);

  return (
    <>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:hidden"
      >
        {stages.map((s, i) => (
          <div key={s.stage} className="w-[88vw] min-w-[88vw] snap-center">
            <StageCard stage={s} index={i} />
          </div>
        ))}
      </div>
      {/* Active dot indicator */}
      <div className="mt-4 flex items-center justify-center gap-2 sm:hidden">
        {stages.map((s, i) => (
          <span
            key={i}
            className={`rounded-full transition-all duration-300 ${i === activeIdx
              ? `h-2 w-6 bg-gradient-to-r ${s.gradient}`
              : "size-2 bg-brand-deep/15"
              }`}
          />
        ))}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN SECTION
   ═══════════════════════════════════════════════════════════ */
export function ClassesSection() {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -left-40 top-20 size-80 rounded-full bg-emerald-100/50 blur-[100px]" />
      <div className="pointer-events-none absolute -right-40 bottom-20 size-80 rounded-full bg-sky-100/40 blur-[100px]" />

      <div className="relative mx-auto max-w-5xl">

        {/* ── Header ── */}
        <div className="mb-8 text-center sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-deep/12 bg-brand-deep/6 px-4 py-1.5 text-xs font-extrabold text-brand-deep">
            <span className="size-1.5 rounded-full bg-brand-deep" />
            الصفوف والتسجيل
          </span>
          <h2 className="mt-3 text-[clamp(1.4rem,5vw,2.5rem)] font-extrabold text-brand-deep sm:mt-4">
            ابدأ رحلة طفلك معنا
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-[0.82rem] leading-7 text-brand-calm/70 sm:mt-3 sm:text-sm">
            مرحلتان تعليميتان مصممتان وفق احتياجات الطفل — التسجيل مباشر عبر الإدارة.
          </p>
        </div>

        {/* ── Stage cards ── */}
        <MobileCardCarousel />
        {/* Desktop: side-by-side grid */}
        <div className="hidden gap-5 sm:grid sm:grid-cols-2">
          {stages.map((s, i) => (
            <StageCard key={s.stage} stage={s} index={i} />
          ))}
        </div>

        {/* ── Bottom CTA row — premium mobile buttons ── */}
        <div className="mt-8 grid gap-3 sm:mt-10 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
          <Link
            href="/admission"
            className="group/cta inline-flex h-[54px] items-center justify-center gap-3 rounded-2xl bg-brand-deep px-8 text-[0.9rem] font-extrabold text-white shadow-[0_12px_32px_rgba(23,72,58,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#11382d] active:scale-[0.97] sm:h-12 sm:rounded-full sm:px-7 sm:text-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-300 group-hover/cta:scale-110">
              <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
            تفاصيل التسجيل
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" className="opacity-40 transition-transform duration-300 group-hover/cta:-translate-x-1"><polyline points="15 18 9 12 15 6" /></svg>
          </Link>
          <Link
            href="/fees"
            className="inline-flex h-[54px] items-center justify-center gap-3 rounded-2xl border-2 border-brand-warm bg-brand-warm/8 px-8 text-[0.9rem] font-extrabold text-brand-deep shadow-[0_4px_16px_rgba(23,72,58,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-warm/18 active:scale-[0.97] sm:h-12 sm:rounded-full sm:px-7 sm:text-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            عرض الرسوم
          </Link>
        </div>
      </div>
    </section>
  );
}
