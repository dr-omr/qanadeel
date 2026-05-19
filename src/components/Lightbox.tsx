"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryImage } from "@/data/school-gallery";

type LightboxProps = {
  image: GalleryImage | null;
  total?: number;
  currentIndex?: number;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
};

export function Lightbox({
  image,
  total = 0,
  currentIndex = 0,
  onClose,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}: LightboxProps) {
  const [isVisible, setIsVisible] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsVisible(Boolean(image));
    });

    return () => cancelAnimationFrame(frame);
  }, [image]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 250);
  }, [onClose]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight" && hasPrev && onPrev) onPrev();
      if (e.key === "ArrowLeft" && hasNext && onNext) onNext();
    },
    [handleClose, onPrev, onNext, hasPrev, hasNext],
  );

  // Touch / swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only horizontal swipes (dx > dy)
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0 && hasNext && onNext) onNext(); // swipe left → next (RTL: next)
      if (dx > 0 && hasPrev && onPrev) onPrev(); // swipe right → prev (RTL: prev)
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  useEffect(() => {
    if (!image) return;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [image, handleKeyDown]);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.25s ease",
      }}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="إغلاق"
        onClick={handleClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Content panel */}
      <div
        className="relative z-10 mx-3 flex max-h-[94svh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#0f1f1a]/97 shadow-[0_40px_120px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
        style={{
          transform: isVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
          transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-extrabold text-white sm:text-base">
              {image.title}
            </h2>
            {image.description && (
              <p className="mt-0.5 truncate text-xs text-white/55">
                {image.description}
              </p>
            )}
          </div>

          {/* Counter badge */}
          {total > 1 && (
            <span className="mx-3 shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-extrabold text-white/70 tabular-nums">
              {currentIndex + 1} / {total}
            </span>
          )}

          {/* Close */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="إغلاق"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Image ── */}
        <div className="relative flex-1 overflow-hidden">
          <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 900px"
              className="object-contain"
              priority
            />
          </div>

          {/* Prev arrow (right in RTL) */}
          {hasPrev && (
            <button
              type="button"
              onClick={onPrev}
              aria-label="الصورة السابقة"
              className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60 active:scale-90 sm:size-12"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          {/* Next arrow (left in RTL) */}
          {hasNext && (
            <button
              type="button"
              onClick={onNext}
              aria-label="الصورة التالية"
              className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60 active:scale-90 sm:size-12"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}
        </div>

        {/* ── Dot indicators ── */}
        {total > 1 && total <= 20 && (
          <div className="flex justify-center gap-1.5 border-t border-white/10 py-3">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "h-2 w-5 bg-brand-warm"
                    : "size-2 bg-white/25"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
