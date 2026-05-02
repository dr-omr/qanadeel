import type { LucideIcon } from "lucide-react";

type AppFeatureIconProps = {
  icon: LucideIcon;
  label?: string;
  active?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "emerald" | "beige" | "gold" | "glass" | "neutral";
  className?: string;
};

const sizes = {
  sm: "size-10 rounded-[0.875rem]",
  md: "size-12 rounded-2xl",
  lg: "size-16 rounded-[1.4rem]",
};

const variants = {
  emerald:
    "border-brand-deep/8 bg-[linear-gradient(145deg,rgba(23,72,58,0.14),rgba(167,191,168,0.28))] text-brand-deep",
  beige:
    "border-brand-warm/25 bg-[linear-gradient(145deg,rgba(247,241,230,0.96),rgba(217,195,154,0.24))] text-brand-deep",
  gold: "border-brand-warm/30 bg-[linear-gradient(145deg,rgba(217,195,154,0.42),rgba(255,255,255,0.80))] text-brand-deep",
  glass: "border-white/22 bg-white/14 text-white backdrop-blur-md",
  neutral:
    "border-brand-line bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(247,241,230,0.68))] text-brand-deep",
};

export function AppFeatureIcon({
  icon: Icon,
  label,
  active = false,
  size = "md",
  variant = "emerald",
  className = "",
}: AppFeatureIconProps) {
  return (
    <span
      aria-label={label}
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden border shadow-[0_10px_28px_rgba(23,72,58,0.08)] transition-all duration-300 ${
        sizes[size]
      } ${
        active
          ? "border-brand-deep bg-brand-deep text-white shadow-[0_14px_36px_rgba(23,72,58,0.18)]"
          : variants[variant]
      } ${className}`}
    >
      {/* Subtle ambient glow */}
      <span
        aria-hidden="true"
        className="absolute -left-2 -top-2 size-8 rounded-full bg-brand-warm/20 blur-lg"
      />
      <Icon
        className={`relative ${size === "lg" ? "size-6" : size === "sm" ? "size-[1.125rem]" : "size-5"}`}
        strokeWidth={active ? 2.5 : 2.2}
        aria-hidden="true"
      />
    </span>
  );
}
