// Server Component — no "use client" needed

import Image from "next/image";
import Link from "next/link";
import { featuredGalleryImages } from "@/data/school-gallery";

/* ═══════════════════════════════════════════════════════════
   Category label map
   ═══════════════════════════════════════════════════════════ */
const categoryLabels: Record<string, string> = {
  events: "فعاليات",
  classrooms: "صفوف",
  activities: "أنشطة",
  play: "لعب",
  facilities: "مرافق",
  staff: "فريق",
};

/* ═══════════════════════════════════════════════════════════
   Masonry grid classes — first image spans 2 cols + 2 rows
   ═══════════════════════════════════════════════════════════ */
const gridClasses = [
  "sm:col-span-2 sm:row-span-2 aspect-[4/3] sm:aspect-auto", // hero image
  "aspect-[4/3]",
  "aspect-[4/3]",
  "aspect-[4/3]",
  "aspect-[4/3]",
  "aspect-[4/3]",
];

export function GalleryPreviewSection() {
  const imgs = featuredGalleryImages.slice(0, 6);
  if (imgs.length === 0) return null;

  return (
    <section className="bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">

        {/* ── Header row — badge + title left, CTA right ── */}
        <div className="mb-10 flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-right">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-deep/12 bg-brand-deep/6 px-4 py-1.5 text-xs font-extrabold text-brand-deep">
              <span className="size-1.5 rounded-full bg-brand-deep" />
              من داخل الروضة
            </span>
            <h2 className="mt-3 text-[clamp(1.4rem,4vw,2.2rem)] font-extrabold text-brand-deep">
              لمحة من بيئة الروضة
            </h2>
            <p className="mt-2 max-w-md text-sm leading-7 text-brand-calm/70">
              صور حقيقية من الصفوف والأنشطة والفعاليات اليومية.
            </p>
          </div>
          <Link
            href="/gallery"
            className="mt-5 inline-flex shrink-0 items-center gap-2 rounded-full border border-brand-line/50 bg-brand-ivory px-5 py-2.5 text-sm font-extrabold text-brand-deep transition-all duration-300 hover:bg-brand-deep hover:text-white sm:mt-0"
          >
            عرض كل الصور
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
        </div>

        {/* ── Desktop masonry grid ── */}
        <div className="hidden gap-3 sm:grid sm:grid-cols-3 sm:grid-rows-2 sm:auto-rows-[200px] lg:auto-rows-[240px]">
          {imgs.map((image, i) => (
            <Link
              key={image.id}
              href="/gallery"
              className={`group relative overflow-hidden rounded-[1.75rem] border border-brand-line/20 bg-brand-ivory shadow-[0_8px_32px_rgba(23,72,58,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_56px_rgba(23,72,58,0.14)] ${gridClasses[i]}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={i === 0 ? "66vw" : "(max-width: 1024px) 50vw, 33vw"}
                className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                priority={i < 2}
              />

              {/* Hover overlay — green tint */}
              <div className="absolute inset-0 bg-brand-deep/0 transition-colors duration-500 group-hover:bg-brand-deep/35" />

              {/* Bottom label — slides up on hover */}
              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-10 transition-transform duration-400 group-hover:translate-y-0">
                <h3 className="text-sm font-extrabold text-white">{image.title}</h3>
                {image.description && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-white/65">{image.description}</p>
                )}
              </div>

              {/* Center zoom icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-white/90 shadow-lg backdrop-blur-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-deep" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </span>
              </div>

              {/* Category pill — top right */}
              <div className="absolute right-3 top-3 rounded-full bg-black/35 px-2.5 py-1 text-[0.6rem] font-bold text-white/85 backdrop-blur-sm">
                {categoryLabels[image.category] ?? "الروضة"}
              </div>
            </Link>
          ))}
        </div>

        {/* ── Mobile horizontal scroll ── */}
        <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:hidden">
          {imgs.map((image, i) => (
            <Link
              key={image.id}
              href="/gallery"
              className="group relative aspect-[4/3] w-[78vw] min-w-[78vw] overflow-hidden rounded-[1.5rem] border border-brand-line/20 bg-brand-ivory shadow-[0_8px_28px_rgba(23,72,58,0.08)]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="78vw"
                className="object-cover transition-transform duration-500 group-active:scale-[1.03]"
                priority={i < 2}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-8">
                <h3 className="text-sm font-extrabold text-white">{image.title}</h3>
              </div>
              {/* Counter badge */}
              <div className="absolute right-3 top-3 rounded-full bg-black/35 px-2 py-0.5 text-[0.6rem] font-bold text-white/80 backdrop-blur-sm">
                {i + 1}/{imgs.length}
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
