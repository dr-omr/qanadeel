"use client";

import { useState } from "react";
import { schoolInfo } from "@/data/school-info";
import { buildWhatsappMessage, buildWhatsappUrl } from "@/lib/whatsapp";

const faqs = [
  {
    id: "q1",
    q: "ما المراحل الدراسية المتاحة؟",
    a: "تضم الروضة مرحلتين: الروضة (صفان) والتمهيدي (صفان)، مرخصة ومعتمدة وفق التعليمات التعليمية في سلطنة عمان.",
  },
  {
    id: "q2",
    q: "كم تبلغ الرسوم الدراسية؟",
    a: "الرسوم المعلنة حالياً هي ٤٠ ريالاً عمانياً شهرياً. يتم تأكيد الرسوم الفعلية مع الإدارة عند بدء التسجيل الرسمي.",
  },
  {
    id: "q3",
    q: "كيف يمكنني تسجيل طفلي؟",
    a: "تواصل مع الإدارة مباشرةً على 94734809، أو أرسل نموذج التواصل عبر الموقع. يتم تأكيد المقعد بعد استكمال البيانات والمستندات.",
  },
  {
    id: "q4",
    q: "ما أوقات الدوام الرسمية؟",
    a: "من الساعة ٦:٣٠ صباحاً حتى ١٢:٣٠ ظهراً، من الأحد إلى الخميس.",
  },
  {
    id: "q5",
    q: "ما المستندات المطلوبة للتسجيل؟",
    a: "شهادة الميلاد، هوية ولي الأمر، هوية الطفل (إن وجدت)، سجل التطعيمات، وصور شخصية للطفل.",
  },
  {
    id: "q6",
    q: "هل يمكنني زيارة الروضة قبل التسجيل؟",
    a: "نعم، يُرحَّب بأولياء الأمور لزيارة بيئة الروضة. نسّق مع الإدارة مسبقاً لتحديد موعد مناسب.",
  },
];

function FaqItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: typeof faqs[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`group overflow-hidden rounded-2xl border transition-all duration-300 ${
        isOpen
          ? "border-brand-deep/20 bg-white shadow-[0_8px_32px_rgba(23,72,58,0.08)]"
          : "border-brand-line/40 bg-white/60 hover:border-brand-deep/15 hover:bg-white"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-5 py-4 text-right sm:px-6 sm:py-5"
        aria-expanded={isOpen}
      >
        {/* Number badge */}
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold transition-all duration-300 ${
            isOpen
              ? "bg-brand-deep text-white"
              : "bg-brand-ivory text-brand-calm group-hover:bg-brand-deep/8"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          className={`flex-1 text-sm font-extrabold leading-snug transition-colors duration-200 sm:text-base ${
            isOpen ? "text-brand-deep" : "text-brand-calm"
          }`}
        >
          {faq.q}
        </span>

        {/* Chevron */}
        <span
          className={`flex size-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            isOpen
              ? "border-brand-deep/20 bg-brand-deep/5 text-brand-deep"
              : "border-brand-line/40 text-brand-calm/50"
          }`}
        >
          <svg
            width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {/* Answer — smooth height animation */}
      <div
        style={{
          maxHeight: isOpen ? "260px" : "0px",
          opacity: isOpen ? 1 : 0,
          transition: "max-height 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease",
          overflow: "hidden",
        }}
      >
        <p className="px-5 pb-5 text-sm leading-8 text-brand-calm sm:px-6">
          {faq.a}
        </p>
      </div>
    </div>
  );
}

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>("q1");

  const whatsappUrl = buildWhatsappUrl(
    schoolInfo.whatsappInternational,
    buildWhatsappMessage({
      schoolName: schoolInfo.shortName,
      requestType: "استفسار",
      message: "لدي سؤال لم أجد إجابته في الموقع.",
    }),
  );

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-calm/20 bg-brand-calm/6 px-4 py-1.5 text-xs font-extrabold text-brand-calm">
            <span className="size-1.5 rounded-full bg-brand-calm/60" />
            الأسئلة الشائعة
          </span>
          <h2 className="mt-4 text-[clamp(1.4rem,4vw,2.2rem)] font-extrabold text-brand-deep">
            إجابات لأكثر الأسئلة شيوعاً
          </h2>
          <p className="mt-2 text-sm text-brand-calm/70">
            لم تجد إجابتك؟ راسلنا مباشرةً.
          </p>
        </div>

        {/* Items */}
        <div className="space-y-2.5">
          {faqs.map((faq, i) => (
            <FaqItem
              key={faq.id}
              faq={faq}
              index={i}
              isOpen={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
            />
          ))}
        </div>

        {/* CTA card */}
        <div className="mt-10 overflow-hidden rounded-2xl bg-brand-deep p-7 text-center shadow-[0_16px_48px_rgba(23,72,58,0.15)]">
          {/* Glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,195,154,0.1)_0%,transparent_65%)]" />

          <p className="relative text-lg font-extrabold text-white">لديك سؤال آخر؟</p>
          <p className="relative mt-1.5 text-sm text-white/55">
            فريقنا جاهز للرد خلال ساعات الدوام
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(37,211,102,0.25)] transition hover:-translate-y-0.5 hover:bg-[#20c05c] active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            تواصل عبر واتساب
          </a>
        </div>

      </div>
    </section>
  );
}
