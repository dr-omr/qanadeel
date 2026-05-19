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
  sm: "size-10 rounded-2xl",
  md: "size-12 rounded-2xl",
  lg: "size-16 rounded-[1.4rem]",
};

const variants = {
  emerald:
    "border-brand-deep/10 bg-[linear-gradient(145deg,rgba(23,72,58,0.16),rgba(167,191,168,0.30))] text-brand-deep",
  beige:
    "border-brand-warm/30 bg-[linear-gradient(145deg,rgba(247,241,230,0.96),rgba(217,195,154,0.26))] text-brand-deep",
  gold: "border-brand-warm/35 bg-[linear-gradient(145deg,rgba(217,195,154,0.44),rgba(255,255,255,0.80))] text-brand-deep",
  glass: "border-white/28 bg-white/16 text-white backdrop-blur-md",
  neutral:
    "border-brand-line bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(247,241,230,0.72))] text-brand-deep",
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
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden border shadow-[0_14px_36px_rgba(23,72,58,0.10)] transition ${
        sizes[size]
      } ${
        active
          ? "border-brand-deep bg-brand-deep text-white shadow-[0_18px_44px_rgba(23,72,58,0.20)]"
          : variants[variant]
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute -left-3 -top-3 size-10 rounded-full bg-brand-warm/25 blur-xl"
      />
      <Icon
        className={`relative ${size === "lg" ? "size-6" : "size-5"}`}
        strokeWidth={active ? 2.6 : 2.25}
        aria-hidden="true"
      />
    </span>
  );
}
