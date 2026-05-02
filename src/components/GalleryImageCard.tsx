"use client";

import Image from "next/image";
import type { GalleryImage } from "@/data/school-gallery";

type GalleryImageCardProps = {
  image: GalleryImage;
  onClick?: () => void;
  priority?: boolean;
};

const categoryConfig: Record<string, { label: string; color: string }> = {
  classrooms: { label: "الصفوف",    color: "bg-sky-500/80" },
  activities: { label: "الأنشطة",   color: "bg-violet-500/80" },
  play:       { label: "اللعب",     color: "bg-orange-500/80" },
  events:     { label: "الفعاليات", color: "bg-brand-deep/80" },
  facilities: { label: "المرافق",   color: "bg-teal-600/80" },
  staff:      { label: "الفريق",    color: "bg-rose-500/80" },
  exterior:   { label: "الواجهة",   color: "bg-amber-600/80" },
};

export function GalleryImageCard({
  image,
  onClick,
  priority = false,
}: GalleryImageCardProps) {
  const cat = categoryConfig[image.category] ?? {
    label: image.category,
    color: "bg-brand-deep/80",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-[2rem] border border-brand-line/40 bg-brand-ivory shadow-[0_8px_24px_rgba(23,72,58,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_64px_rgba(23,72,58,0.14)] focus-visible:outline-2 focus-visible:outline-brand-deep active:scale-[0.98]"
      aria-label={`عرض صورة: ${image.title}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        priority={priority}
      />

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/75 via-black/35 to-transparent" />

      {/* Category badge */}
      <span
        className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[0.65rem] font-extrabold text-white shadow-md backdrop-blur-md ${cat.color}`}
      >
        {cat.label}
      </span>

      {/* Featured star */}
      {image.featured && (
        <span className="absolute left-3 top-3 flex size-7 items-center justify-center rounded-full bg-brand-warm/90 text-white shadow-md backdrop-blur-md">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </span>
      )}

      {/* Title */}
      <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-8">
        <h3 className="text-sm font-extrabold text-white drop-shadow-sm sm:text-base">
          {image.title}
        </h3>
        {image.description && (
          <p className="mt-1 line-clamp-1 text-[0.7rem] font-bold leading-5 text-white/75 drop-shadow-sm">
            {image.description}
          </p>
        )}
      </div>

      {/* Hover zoom overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-brand-deep/0 transition-all duration-500 group-hover:bg-brand-deep/15">
        <span className="scale-0 rounded-full bg-white/95 p-3.5 shadow-xl transition-all duration-500 group-hover:scale-100 group-hover:rotate-0 rotate-[-15deg]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brand-deep"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </span>
      </div>
    </button>
  );
}
