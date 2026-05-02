"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  galleryCategories,
  galleryImages,
  featuredGalleryImages,
  type GalleryImage,
} from "@/data/school-gallery";
import { Lightbox } from "@/components/Lightbox";

const MASONRY_PREVIEW_COUNT = 9;

/* ─── distribute images into N masonry columns ─── */
function buildColumns(images: GalleryImage[], cols: number): GalleryImage[][] {
  const columns: GalleryImage[][] = Array.from({ length: cols }, () => []);
  images.forEach((img, i) => columns[i % cols].push(img));
  return columns;
}

const categoryConfig: Record<string, { label: string; color: string }> = {
  classrooms: { label: "الصفوف", color: "bg-sky-500/85" },
  activities: { label: "الأنشطة", color: "bg-violet-500/85" },
  play: { label: "اللعب", color: "bg-orange-500/85" },
  events: { label: "الفعاليات", color: "bg-brand-deep/85" },
  facilities: { label: "المرافق", color: "bg-teal-600/85" },
  staff: { label: "الفريق", color: "bg-rose-500/85" },
  exterior: { label: "الواجهة", color: "bg-amber-600/85" },
};

/* ────────────────────────────────────────────────
   STORY MODE — fullscreen auto-advancing slides
   ──────────────────────────────────────────────── */
function StoryMode({
  images,
  startIndex,
  onClose,
}: {
  images: GalleryImage[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const DURATION = 3000;

  const goNext = useCallback(() => {
    setIndex((p) => (p + 1) % images.length);
    setProgress(0);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setIndex((p) => (p - 1 + images.length) % images.length);
    setProgress(0);
  }, [images.length]);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { goNext(); return 0; }
        return p + (100 / (DURATION / 100));
      });
    }, 100);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [paused, goNext]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goNext();
      if (e.key === "ArrowRight") goPrev();
      if (e.key === " ") { e.preventDefault(); setPaused((p) => !p); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goNext, goPrev]);

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  const img = images[index];

  return (
    <div
      className="fixed inset-0 z-[200] bg-black"
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
    >
      {/* Progress bars */}
      <div className="absolute inset-x-0 top-0 z-10 flex gap-1 px-3 pt-3">
        {images.map((_, i) => (
          <div key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
            <div
              className="h-full bg-white transition-none"
              style={{ width: i < index ? "100%" : i === index ? `${progress}%` : "0%" }}
            />
          </div>
        ))}
      </div>

      {/* Top bar */}
      <div className="absolute inset-x-0 top-6 z-10 flex items-center justify-between px-4 pt-2">
        <span className="text-xs font-extrabold text-white/70 tabular-nums">
          {index + 1} / {images.length}
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold text-white backdrop-blur-sm"
          >
            {paused ? "▶ تشغيل" : "⏸ إيقاف"}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="flex size-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="absolute inset-0">
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />

      {/* Caption */}
      <div className="absolute inset-x-0 bottom-8 px-6 text-center">
        <h3 className="text-lg font-extrabold text-white drop-shadow-lg">{img.title}</h3>
        {img.description && (
          <p className="mt-1 text-sm text-white/75">{img.description}</p>
        )}
      </div>

      {/* Tap zones for prev/next */}
      <button
        type="button"
        aria-label="السابق"
        onClick={goPrev}
        className="absolute inset-y-0 right-0 w-1/3"
      />
      <button
        type="button"
        aria-label="التالي"
        onClick={goNext}
        className="absolute inset-y-0 left-0 w-1/3"
      />
    </div>
  );
}

/* ────────────────────────────────────────────────
   FEATURED STRIP — horizontal scrollable carousel
   ──────────────────────────────────────────────── */
function FeaturedStrip({ images, onSelect }: { images: GalleryImage[]; onSelect: (img: GalleryImage) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  useEffect(() => { checkScroll(); }, [images]);

  if (images.length < 2) return null;

  return (
    <div className="relative mb-8">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-brand-deep">
        <span className="flex size-5 items-center justify-center rounded-full bg-brand-warm/20 text-[0.55rem] text-brand-warm">★</span>
        صور مميزة
      </h3>
      <div className="relative">
        {canScrollLeft && (
          <button type="button" onClick={() => scroll("left")}
            className="absolute -right-2 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-brand-line/40 bg-white shadow-lg transition hover:bg-brand-ivory active:scale-90">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        )}
        {canScrollRight && (
          <button type="button" onClick={() => scroll("right")}
            className="absolute -left-2 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-brand-line/40 bg-white shadow-lg transition hover:bg-brand-ivory active:scale-90">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
        )}
        <div ref={scrollRef} onScroll={checkScroll}
          className="scrollbar-none flex gap-3 overflow-x-auto scroll-smooth rounded-2xl">
          {images.map((img) => (
            <button key={img.id} type="button" onClick={() => onSelect(img)}
              className="group relative aspect-[16/10] w-64 shrink-0 overflow-hidden rounded-2xl border border-brand-line/30 bg-brand-ivory shadow-[0_4px_16px_rgba(23,72,58,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(23,72,58,0.12)] active:scale-[0.98] sm:w-72">
              <Image src={img.src} alt={img.alt} fill sizes="288px" className="object-cover transition-transform duration-500 group-hover:scale-105" loading="eager" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 px-3 pb-3">
                <p className="text-xs font-extrabold text-white drop-shadow">{img.title}</p>
              </div>
              <span className="absolute left-2 top-2 flex size-5 items-center justify-center rounded-full bg-brand-warm/90 text-[0.5rem] font-extrabold text-white shadow">★</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   SCROLL TO TOP BUTTON
   ──────────────────────────────────────────────── */
function ScrollToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  if (!show) return null;
  return (
    <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="العودة للأعلى"
      className="fixed bottom-24 left-4 z-40 flex size-11 items-center justify-center rounded-full border border-brand-line/40 bg-white/90 text-brand-deep shadow-[0_8px_24px_rgba(23,72,58,0.12)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(23,72,58,0.18)] active:scale-90 lg:bottom-8"
      style={{ animation: "scaleIn 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polyline points="18 15 12 9 6 15" /></svg>
    </button>
  );
}

/* ────────────────────────────────────────────────
   MASONRY CARD
   ──────────────────────────────────────────────── */
function MasonryCard({
  image,
  index,
  onClick,
}: {
  image: GalleryImage;
  index: number;
  onClick: () => void;
}) {
  const cat = categoryConfig[image.category] ?? { label: image.category, color: "bg-brand-deep/85" };

  /* alternate tall/normal aspect for masonry feel */
  const isTall = index % 5 === 1 || index % 5 === 3;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative mb-4 w-full cursor-pointer overflow-hidden rounded-[1.75rem] border border-brand-line/30 bg-brand-ivory shadow-[0_8px_24px_rgba(23,72,58,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_56px_rgba(23,72,58,0.14)] active:scale-[0.98] ${isTall ? "aspect-[3/4]" : "aspect-[4/3]"}`}
      aria-label={`عرض: ${image.title}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        loading={index < 6 ? "eager" : "lazy"}
        placeholder="empty"
      />

      {/* Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Category badge */}
      <span className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-[0.6rem] font-extrabold text-white shadow-md backdrop-blur-md ${cat.color}`}>
        {cat.label}
      </span>

      {/* Featured star */}
      {image.featured && (
        <span className="absolute left-3 top-3 flex size-6 items-center justify-center rounded-full bg-brand-warm/95 text-[0.6rem] text-white shadow-md">
          ★
        </span>
      )}

      {/* Title */}
      <div className="absolute inset-x-0 bottom-0 px-4 pb-4">
        <h3 className="text-sm font-extrabold text-white drop-shadow">{image.title}</h3>
        {image.description && (
          <p className="mt-0.5 line-clamp-1 text-[0.65rem] text-white/70">{image.description}</p>
        )}
      </div>

      {/* Hover zoom icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="rounded-full bg-white/90 p-3 shadow-xl">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-deep" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </span>
      </div>
    </button>
  );
}

/* ────────────────────────────────────────────────
   MAIN PAGE CLIENT
   ──────────────────────────────────────────────── */
export function GalleryPageClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const [cols, setCols] = useState(3);
  const [masonryExpanded, setMasonryExpanded] = useState(false);

  // Responsive column count
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setCols(1);
      else if (window.innerWidth < 1024) setCols(2);
      else setCols(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const filteredImages =
    activeCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const currentIndex = lightboxImage
    ? filteredImages.findIndex((img) => img.id === lightboxImage.id)
    : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setLightboxImage(filteredImages[currentIndex - 1]);
  }, [currentIndex, filteredImages]);

  const handleNext = useCallback(() => {
    if (currentIndex < filteredImages.length - 1) setLightboxImage(filteredImages[currentIndex + 1]);
  }, [currentIndex, filteredImages]);

  const columns = buildColumns(filteredImages, cols);

  return (
    <>
      {/* ── Dark Hero ── */}
      <section className="relative overflow-hidden bg-brand-deep px-4 pb-10 pt-12 sm:px-6 sm:pb-14 sm:pt-16 lg:px-8 lg:pb-20 lg:pt-24">
        <div className="pointer-events-none absolute -right-32 -top-32 size-[600px] rounded-full bg-brand-warm/8 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-emerald-400/5 blur-[70px]" />

        <div className="relative mx-auto max-w-7xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-warm/30 bg-brand-warm/10 px-4 py-1.5 text-xs font-extrabold text-brand-warm">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            معرض الصور
          </span>

          <h1 className="mt-4 text-[clamp(1.8rem,5vw,3.2rem)] font-extrabold leading-[1.3] text-white">
            لمحات من بيئة مدرسة قناديل العلم (مرحلة الروضة)
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
            اضغط أي صورة لعرضها بحجم كامل — أو شاهد المعرض كقصة متتالية.
          </p>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
            {[
              { value: `${galleryImages.length}`, label: "صورة" },
              { value: `${galleryImages.filter((i) => i.category === "events").length}`, label: "فعالية" },
              { value: `${galleryImages.filter((i) => i.category === "classrooms").length}`, label: "يوم دراسي" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-extrabold text-white">{s.value}</p>
                <p className="text-xs font-bold text-white/45">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Story Mode CTA */}
          <button
            type="button"
            onClick={() => setStoryIndex(0)}
            className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-brand-warm px-6 py-3 text-sm font-extrabold text-brand-deep shadow-[0_8px_24px_rgba(217,195,154,0.35)] transition hover:-translate-y-0.5 hover:bg-[#e8d08a] active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            مشاهدة المعرض كقصة
          </button>
        </div>
      </section>

      {/* ── Category Filters ── */}
      <section className="sticky top-[3.25rem] z-30 border-b border-brand-line/40 bg-brand-ivory/95 backdrop-blur-xl sm:top-[3.75rem] lg:top-[4.5rem]">
        <div className="scrollbar-none mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:justify-center lg:px-8">
          {galleryCategories.map((cat) => {
            const count = cat.id === "all" ? galleryImages.length : galleryImages.filter((img) => img.category === cat.id).length;
            if (cat.id !== "all" && count === 0) return null;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-extrabold transition-all duration-300 active:scale-95 ${isActive ? "bg-brand-deep text-white shadow-[0_8px_24px_rgba(23,72,58,0.18)]" : "bg-white/70 text-brand-calm hover:bg-white hover:text-brand-deep"}`}
              >
                {cat.label}
                <span className={`rounded-full px-1.5 py-0.5 text-[0.6rem] font-extrabold ${isActive ? "bg-white/20 text-white" : "bg-brand-line/60 text-brand-calm"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Masonry Gallery ── */}
      <section className="bg-brand-ivory px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          {filteredImages.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-lg font-extrabold text-brand-deep">لا توجد صور في هذا التصنيف</p>
              <p className="mt-2 text-sm text-brand-calm">سيتم إضافة صور قريبًا إن شاء الله.</p>
            </div>
          ) : (
            <>
              {/* Featured images carousel */}
              <FeaturedStrip
                images={featuredGalleryImages.filter(img => activeCategory === "all" || img.category === activeCategory)}
                onSelect={(img) => setLightboxImage(img)}
              />

              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-bold text-brand-calm">
                  {filteredImages.length} صورة
                  {!masonryExpanded && filteredImages.length > MASONRY_PREVIEW_COUNT && (
                    <span className="text-brand-calm/50"> · يعرض أول {MASONRY_PREVIEW_COUNT}</span>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const startIdx = filteredImages.findIndex((img) => img === filteredImages[0]);
                    setStoryIndex(startIdx >= 0 ? startIdx : 0);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-deep/8 px-4 py-2 text-xs font-extrabold text-brand-deep transition hover:bg-brand-deep/15"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  عرض قصصي
                </button>
              </div>

              {/* Masonry columns — collapsible */}
              <div
                className="gap-4"
                style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)` }}
              >
                {buildColumns(
                  masonryExpanded ? filteredImages : filteredImages.slice(0, MASONRY_PREVIEW_COUNT),
                  cols
                ).map((col, colIdx) => (
                  <div key={colIdx} className="flex flex-col">
                    {col.map((image, rowIdx) => (
                      <MasonryCard
                        key={image.id}
                        image={image}
                        index={colIdx + rowIdx * cols}
                        onClick={() => setLightboxImage(image)}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Expand / Collapse button */}
              {filteredImages.length > MASONRY_PREVIEW_COUNT && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setMasonryExpanded(prev => !prev)}
                    className="inline-flex items-center gap-2.5 rounded-full border border-brand-line/40 bg-white px-7 py-3 text-sm font-extrabold text-brand-deep shadow-[0_4px_16px_rgba(23,72,58,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(23,72,58,0.12)] active:scale-95"
                  >
                    {masonryExpanded ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polyline points="18 15 12 9 6 15" /></svg>
                        إخفاء الصور
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
                        عرض كل الصور ({filteredImages.length})
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Lightbox ── */}
      <Lightbox
        image={lightboxImage}
        total={filteredImages.length}
        currentIndex={currentIndex}
        onClose={() => setLightboxImage(null)}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={currentIndex > 0}
        hasNext={currentIndex < filteredImages.length - 1}
      />

      {/* ── Story Mode ── */}
      {storyIndex !== null && (
        <StoryMode
          images={filteredImages}
          startIndex={storyIndex}
          onClose={() => setStoryIndex(null)}
        />
      )}

      {/* ── Scroll to top ── */}
      <ScrollToTop />

      {/* ── Bottom tip banner ── */}
      <section className="border-t border-brand-line/30 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center sm:flex-row sm:text-start">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-deep/8">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-deep" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-extrabold text-brand-deep">هل تريد نسخة من الصور؟</p>
            <p className="mt-0.5 text-xs leading-6 text-brand-calm">تواصل مع إدارة الروضة عبر واتساب وسنرسل لك الصور الأصلية بجودة عالية.</p>
          </div>
        </div>
      </section>
    </>
  );
}
