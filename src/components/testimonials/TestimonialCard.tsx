import { BadgeCheck, Quote, Sparkles, UserRound } from "lucide-react";
import type { PublicTestimonial } from "@/lib/testimonials";
import {
  formatArabicDate,
  testimonialRoleLabels,
} from "@/lib/testimonial-labels";
import { RatingStars } from "./RatingStars";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export function TestimonialCard({
  testimonial,
}: {
  testimonial: PublicTestimonial;
}) {
  const date = testimonial.approvedAt || testimonial.createdAt;

  return (
    <article
      className={`group relative h-full overflow-hidden rounded-[2rem] border p-5 text-brand-deep transition duration-300 hover:-translate-y-1 sm:p-6 ${
        testimonial.isFeatured
          ? "border-brand-warm/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(217,195,154,0.18),rgba(167,191,168,0.18))] shadow-[0_30px_90px_rgba(23,72,58,0.16)]"
          : "border-brand-line bg-white/92 shadow-[0_22px_68px_rgba(23,72,58,0.10)]"
      }`}
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-l from-transparent via-brand-warm/75 to-transparent" />
      <Quote
        className="absolute -left-2 top-4 size-16 rotate-180 text-brand-light/25 transition group-hover:text-brand-warm/30"
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-deep text-sm font-extrabold text-white shadow-inner">
            {getInitials(testimonial.name) || (
              <UserRound className="size-5" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-extrabold">
              {testimonial.name}
            </h3>
            <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-brand-paper px-3 py-1 text-xs font-extrabold text-brand-calm">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
              {testimonialRoleLabels[testimonial.role]}
            </p>
          </div>
        </div>

        {testimonial.isFeatured ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-warm px-3 py-1 text-xs font-extrabold text-brand-deep">
            <Sparkles className="size-3.5" aria-hidden="true" />
            مميز
          </span>
        ) : null}
      </div>

      <div className="relative mt-5">
        <RatingStars rating={testimonial.rating} />
        <p className="mt-4 break-words text-sm leading-8 text-brand-calm sm:text-base">
          {testimonial.comment}
        </p>
        <time
          dateTime={date}
          className="mt-5 block text-xs font-extrabold text-brand-calm/85"
        >
          {formatArabicDate(date)}
        </time>
      </div>
    </article>
  );
}
