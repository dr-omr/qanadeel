"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "qandeel_ann_dismissed";

const announcements = [
  { text: "📢 باب التسجيل مفتوح للعام الدراسي ٢٠٢٦/٢٠٢٧", cta: "سجّل الآن", href: "/admission" },
  { text: "📚 نقبل الأطفال من عمر ٤ إلى ٦ سنوات", cta: "تفاصيل", href: "/about" },
  { text: "💰 الرسوم الشهرية ٤٠ ريال عماني فقط", cta: "الرسوم", href: "/fees" },
];

const CYCLE_MS = 4000;

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setDismissed(false);
    } catch {
      setDismissed(false);
    }
  }, []);

  // Auto-cycle
  useEffect(() => {
    if (dismissed) return;
    const t = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((p) => (p + 1) % announcements.length);
        setAnimating(false);
      }, 300);
    }, CYCLE_MS);
    return () => clearInterval(t);
  }, [dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* noop */ }
  };

  if (dismissed) return null;

  const ann = announcements[current];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-brand-deep via-[#1a5441] to-brand-deep">
      {/* Shimmer sweep */}
      <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.06)_50%,transparent_60%)] animate-[shimmer_3s_ease-in-out_infinite]" />

      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        {/* Dot indicator — desktop */}
        <div className="hidden items-center gap-1 sm:flex">
          {announcements.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "h-1.5 w-4 bg-brand-warm"
                  : "size-1.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`إعلان ${i + 1}`}
            />
          ))}
        </div>

        {/* Text */}
        <p
          className="flex-1 text-center text-[0.72rem] font-extrabold text-white/90 sm:text-xs"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating ? "translateY(-4px)" : "translateY(0)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          {ann.text}
        </p>

        {/* CTA + close */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={ann.href}
            className="hidden rounded-full bg-brand-warm/15 px-3.5 py-1 text-[0.68rem] font-extrabold text-brand-warm ring-1 ring-brand-warm/25 transition-all duration-200 hover:bg-brand-warm/25 sm:inline-block"
          >
            {ann.cta}
          </Link>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="إغلاق"
            className="flex size-5 items-center justify-center rounded-full text-white/30 transition hover:text-white"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
