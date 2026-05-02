"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { schoolInfo } from "@/data/school-info";

/* ═══════════════════════════════════════════════════════════
   INFO CARD
   ═══════════════════════════════════════════════════════════ */
function InfoCard({
  icon,
  eyebrow,
  value,
  description,
  href,
  hrefLabel,
  hrefExternal = false,
  accent,
  index,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  value: string;
  description: string;
  href: string;
  hrefLabel: string;
  hrefExternal?: boolean;
  accent: "brand" | "gold" | "sky";
  index: number;
}) {
  const [visible, setVisible] = useState(false);
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

  const accentMap = {
    brand: {
      iconBg: "bg-brand-deep",
      pill: "bg-brand-deep/8 text-brand-deep border-brand-deep/15",
      btn: "bg-brand-deep text-white hover:bg-[#11382d]",
    },
    gold: {
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
      pill: "bg-amber-50 text-amber-700 border-amber-200/60",
      btn: "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg",
    },
    sky: {
      iconBg: "bg-gradient-to-br from-sky-500 to-blue-500",
      pill: "bg-sky-50 text-sky-700 border-sky-200/60",
      btn: "bg-gradient-to-r from-sky-500 to-blue-500 text-white hover:shadow-lg",
    },
  };

  const a = accentMap[accent];

  return (
    <div
      ref={ref}
      className="group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-white p-5 ring-1 ring-brand-line/15 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(23,72,58,0.08)] hover:ring-brand-line/30 sm:rounded-[2rem] sm:p-7"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {/* Icon */}
      <div className={`mb-4 flex size-11 items-center justify-center rounded-xl text-white shadow-md sm:size-12 sm:rounded-2xl ${a.iconBg}`}>
        {icon}
      </div>

      {/* Eyebrow pill */}
      <span className={`mb-2 inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.65rem] font-extrabold ${a.pill}`}>
        {eyebrow}
      </span>

      {/* Value */}
      <h3 className="text-xl font-extrabold text-brand-deep sm:text-2xl">{value}</h3>

      {/* Description */}
      <p className="mt-2 flex-1 text-[0.82rem] leading-7 text-brand-calm/70 sm:text-sm">{description}</p>

      {/* CTA */}
      {hrefExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl text-[0.8rem] font-extrabold transition-all duration-300 active:scale-[0.97] sm:h-11 sm:rounded-2xl sm:text-sm ${a.btn}`}
        >
          {hrefLabel}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        </a>
      ) : (
        <Link
          href={href}
          className={`mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl text-[0.8rem] font-extrabold transition-all duration-300 active:scale-[0.97] sm:h-11 sm:rounded-2xl sm:text-sm ${a.btn}`}
        >
          {hrefLabel}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        </Link>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN SECTION
   ═══════════════════════════════════════════════════════════ */
export function InfoSection() {
  return (
    <section className="bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 text-center sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-deep/12 bg-brand-deep/6 px-4 py-1.5 text-xs font-extrabold text-brand-deep">
            <span className="size-1.5 rounded-full bg-brand-deep" />
            معلومات مهمة
          </span>
          <h2 className="mt-3 text-[clamp(1.4rem,5vw,2.5rem)] font-extrabold text-brand-deep sm:mt-4">
            الرسوم والموقع والدوام
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[0.82rem] leading-7 text-brand-calm/70 sm:mt-3 sm:text-sm">
            كل ما يحتاج ولي الأمر معرفته قبل التسجيل — بشفافية كاملة.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">

          {/* Fees card */}
          <InfoCard
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}
            eyebrow="الرسوم الشهرية"
            value="٤٠ ريال عماني"
            description="رسوم دراسية معلنة، يتم تأكيدها مع إدارة الروضة عند التسجيل."
            href="/fees"
            hrefLabel="تفاصيل الرسوم"
            accent="gold"
            index={0}
          />

          {/* Location card */}
          <InfoCard
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>}
            eyebrow="الموقع"
            value={schoolInfo.address}
            description="مدرسة قناديل العلم (مرحلة الروضة) — صحار / الجفرة، سلطنة عمان"
            href={schoolInfo.mapUrl}
            hrefLabel="فتح الخريطة"
            hrefExternal
            accent="brand"
            index={1}
          />

          {/* Working hours card */}
          <InfoCard
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
            eyebrow="أوقات الدوام"
            value="٦:٣٠ — ١٢:٣٠"
            description={schoolInfo.workingHours}
            href="/contact"
            hrefLabel="بيانات التواصل"
            accent="sky"
            index={2}
          />
        </div>

      </div>
    </section>
  );
}
