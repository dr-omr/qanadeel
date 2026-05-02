import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type IconBadgeProps = {
  children?: ReactNode;
  icon?: LucideIcon;
  label?: string;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
  active?: boolean;
  tone?:
    | "emerald"
    | "beige"
    | "gold"
    | "glass"
    | "danger"
    | "neutral"
    | "green";
  variant?:
    | "emerald"
    | "beige"
    | "gold"
    | "glass"
    | "danger"
    | "neutral"
    | "green";
};

const sizes = {
  xs: "size-8 rounded-xl",
  sm: "size-10 rounded-[0.875rem]",
  md: "size-12 rounded-2xl",
  lg: "size-16 rounded-[1.4rem]",
};

const iconSizes = {
  xs: "size-4",
  sm: "size-[1.125rem]",
  md: "size-5",
  lg: "size-6",
};

const tones: Record<NonNullable<IconBadgeProps["tone"]>, string> = {
  emerald:
    "border-brand-deep/8 bg-[linear-gradient(145deg,rgba(23,72,58,0.14),rgba(167,191,168,0.28))] text-brand-deep ring-brand-deep/8",
  green:
    "border-brand-deep/8 bg-[linear-gradient(145deg,rgba(23,72,58,0.14),rgba(167,191,168,0.28))] text-brand-deep ring-brand-deep/8",
  beige:
    "border-brand-warm/25 bg-[linear-gradient(145deg,rgba(247,241,230,0.96),rgba(217,195,154,0.28))] text-brand-deep ring-brand-warm/20",
  gold: "border-brand-warm/30 bg-[linear-gradient(145deg,rgba(217,195,154,0.40),rgba(255,255,255,0.78))] text-brand-deep ring-brand-warm/25",
  glass:
    "border-white/22 bg-white/14 text-white ring-white/18 backdrop-blur-md",
  danger:
    "border-red-200/80 bg-[linear-gradient(145deg,rgba(254,242,242,0.96),rgba(252,165,165,0.18))] text-red-700 ring-red-200/35",
  neutral:
    "border-brand-line bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(247,241,230,0.68))] text-brand-deep ring-brand-line",
};

export function IconBadge({
  children,
  icon: Icon,
  label,
  className = "",
  size = "md",
  active = false,
  tone = "emerald",
  variant,
}: IconBadgeProps) {
  const resolvedTone = variant || tone;

  return (
    <span
      aria-label={label}
      className={`relative flex shrink-0 items-center justify-center overflow-hidden border shadow-[0_8px_24px_rgba(23,72,58,0.10)] ring-1 transition-all duration-300 ${sizes[size]} ${tones[resolvedTone]} ${
        active
          ? "scale-[1.04] shadow-[0_12px_32px_rgba(23,72,58,0.16)] ring-2"
          : ""
      } ${className}`}
    >
      {/* Inner glow */}
      <span
        aria-hidden="true"
        className="absolute inset-0.5 rounded-[inherit] bg-white/15"
      />
      {/* Light refraction */}
      <span
        aria-hidden="true"
        className="absolute -left-3 -top-3 size-8 rounded-full bg-white/40 blur-lg"
      />
      <span className="relative">
        {Icon ? (
          <Icon
            className={iconSizes[size]}
            strokeWidth={2.3}
            aria-hidden="true"
          />
        ) : (
          children
        )}
      </span>
    </span>
  );
}
