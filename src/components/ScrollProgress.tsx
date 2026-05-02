"use client";

import { useEffect, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR + BACK TO TOP
   ═══════════════════════════════════════════════════════════ */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const total = scrollHeight - clientHeight;
    if (total > 0) {
      setProgress((scrollTop / total) * 100);
    }
    setShowTop(scrollTop > 500);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ── Progress bar ── */}
      <div className="fixed inset-x-0 top-0 z-[100] h-[3px]">
        <div
          className="h-full bg-gradient-to-l from-brand-warm via-emerald-400 to-brand-deep transition-[width] duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
        {/* Glow tip */}
        <div
          className="absolute top-0 h-[3px] w-8 blur-[6px] bg-brand-warm/60 transition-[left] duration-100 ease-out"
          style={{ left: `calc(${progress}% - 16px)` }}
        />
      </div>

      {/* ── Back to top button ── */}
      <button
        onClick={scrollToTop}
        aria-label="العودة للأعلى"
        className="fixed bottom-24 left-4 z-50 flex size-11 items-center justify-center rounded-2xl bg-brand-deep/90 text-white shadow-[0_8px_24px_rgba(23,72,58,0.25)] backdrop-blur-sm ring-1 ring-white/10 transition-all duration-400 hover:bg-brand-deep hover:shadow-[0_12px_32px_rgba(23,72,58,0.35)] hover:-translate-y-0.5 active:scale-90 sm:bottom-8 sm:left-6 sm:size-12"
        style={{
          opacity: showTop ? 1 : 0,
          transform: showTop ? "translateY(0) scale(1)" : "translateY(16px) scale(0.8)",
          pointerEvents: showTop ? "auto" : "none",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </>
  );
}
