import { Star } from "lucide-react";

type RatingStarsProps = {
  rating?: number;
  interactive?: boolean;
  onChange?: (value?: number) => void;
  className?: string;
};

export function RatingStars({
  rating,
  interactive = false,
  onChange,
  className = "",
}: RatingStarsProps) {
  if (!rating && !interactive) {
    return (
      <span className={`text-xs font-extrabold text-brand-calm ${className}`}>
        بدون تقييم
      </span>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`}>
      {interactive ? (
        <button
          type="button"
          aria-pressed={!rating}
          onClick={() => onChange?.(undefined)}
          className="min-h-10 rounded-full border border-brand-line bg-white px-3 text-xs font-extrabold text-brand-calm transition hover:border-brand-warm hover:text-brand-deep aria-pressed:border-brand-deep aria-pressed:bg-brand-deep aria-pressed:text-white"
        >
          بدون تقييم
        </button>
      ) : null}

      <div className="flex flex-row-reverse items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => {
          const isActive = Boolean(rating && value <= rating);
          const iconClass = `size-5 ${
            isActive ? "fill-brand-warm text-brand-warm" : "text-brand-line"
          }`;

          if (!interactive) {
            return <Star key={value} className={iconClass} aria-hidden="true" />;
          }

          return (
            <button
              key={value}
              type="button"
              aria-label={`${value} من ٥`}
              aria-pressed={rating === value}
              onClick={() => onChange?.(value)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-brand-line bg-white text-brand-calm transition hover:-translate-y-0.5 hover:border-brand-warm hover:text-brand-deep aria-pressed:border-brand-warm aria-pressed:bg-brand-paper"
            >
              <Star className={iconClass} aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
