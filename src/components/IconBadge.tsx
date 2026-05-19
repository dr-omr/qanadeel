import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type IconBadgeProps = {
  children?: ReactNode;
  icon?: LucideIcon;
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
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
  sm: "size-10 rounded-2xl",
  md: "size-12 rounded-2xl",
  lg: "size-16 rounded-[1.4rem]",
};

const tones: Record<NonNullable<IconBadgeProps["tone"]>, string> = {
  emerald:
    "border-brand-deep/10 bg-[linear-gradient(145deg,rgba(23,72,58,0.18),rgba(167,191,168,0.30))] text-brand-deep ring-brand-deep/10",
  green:
    "border-brand-deep/10 bg-[linear-gradient(145deg,rgba(23,72,58,0.18),rgba(167,191,168,0.30))] text-brand-deep ring-brand-deep/10",
  beige:
    "border-brand-warm/30 bg-[linear-gradient(145deg,rgba(247,241,230,0.95),rgba(217,195,154,0.30))] text-brand-deep ring-brand-warm/25",
  gold: "border-brand-warm/35 bg-[linear-gradient(145deg,rgba(217,195,154,0.42),rgba(255,255,255,0.78))] text-brand-deep ring-brand-warm/30",
  glass:
    "border-white/25 bg-white/16 text-white ring-white/20 backdrop-blur-md",
  danger:
    "border-red-200 bg-[linear-gradient(145deg,rgba(254,242,242,0.96),rgba(252,165,165,0.20))] text-red-700 ring-red-200/40",
  neutral:
    "border-brand-line bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(247,241,230,0.72))] text-brand-deep ring-brand-line",
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
  const iconSize =
    size === "lg" ? "size-6" : size === "sm" ? "size-[1.125rem]" : "size-5";

  return (
    <span
      aria-label={label}
      className={`relative flex shrink-0 items-center justify-center overflow-hidden border shadow-[0_12px_34px_rgba(23,72,58,0.12)] ring-1 transition duration-300 ${sizes[size]} ${tones[resolvedTone]} ${
        active
          ? "scale-[1.03] shadow-[0_16px_42px_rgba(23,72,58,0.18)] ring-2"
          : ""
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-1 rounded-[inherit] bg-white/18"
      />
      <span
        aria-hidden="true"
        className="absolute -left-4 -top-4 size-10 rounded-full bg-white/45 blur-xl"
      />
      <span className="relative">
        {Icon ? (
          <Icon className={iconSize} strokeWidth={2.4} aria-hidden="true" />
        ) : (
          children
        )}
      </span>
    </span>
  );
}
