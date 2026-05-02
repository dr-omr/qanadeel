import type { ReactNode } from "react";
import { IconBadge } from "./IconBadge";

type PremiumCardVariant =
  | "default"
  | "feature"
  | "stat"
  | "fee"
  | "policy"
  | "contact"
  | "glass"
  | "highlighted"
  | "compact"
  | "strong"
  | "soft";

type PremiumCardProps = {
  children?: ReactNode;
  className?: string;
  variant?: PremiumCardVariant;
  hover?: boolean;
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
  accent?: "green" | "gold" | "soft";
};

const variants: Record<PremiumCardVariant, string> = {
  default:
    "border-brand-line bg-white/85 text-brand-deep shadow-[0_24px_80px_rgba(23,72,58,0.10)]",
  feature:
    "border-brand-line bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(247,241,230,0.78))] text-brand-deep shadow-[0_24px_80px_rgba(23,72,58,0.10)]",
  stat:
    "border-brand-line bg-white/90 text-brand-deep shadow-[0_18px_52px_rgba(23,72,58,0.08)]",
  fee: "border-brand-deep/15 bg-brand-deep text-white shadow-[0_30px_90px_rgba(23,72,58,0.24)]",
  policy:
    "border-brand-line bg-brand-ivory/90 text-brand-deep shadow-[0_20px_64px_rgba(23,72,58,0.08)]",
  contact:
    "border-brand-line bg-white/90 text-brand-deep shadow-[0_24px_78px_rgba(23,72,58,0.10)]",
  glass:
    "border-white/30 bg-white/14 text-white shadow-[0_24px_80px_rgba(0,0,0,0.16)]",
  highlighted:
    "border-brand-warm/45 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(217,195,154,0.26))] text-brand-deep shadow-[0_28px_84px_rgba(23,72,58,0.12)]",
  compact:
    "border-brand-line bg-[#fffcf5]/90 text-brand-deep shadow-[0_14px_38px_rgba(23,72,58,0.07)]",
  strong:
    "border-brand-deep/15 bg-brand-deep text-white shadow-[0_24px_72px_rgba(23,72,58,0.22)]",
  soft:
    "border-brand-line bg-brand-paper/90 text-brand-deep shadow-[0_18px_50px_rgba(23,72,58,0.07)]",
};

const accentClasses = {
  green: "after:bg-brand-deep/10",
  gold: "after:bg-brand-warm/24",
  soft: "after:bg-brand-light/16",
};

export function PremiumCard({
  children,
  className = "",
  variant = "default",
  hover = true,
  icon,
  title,
  description,
  meta,
  action,
  accent = "gold",
}: PremiumCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] border backdrop-blur-sm transition duration-300 active:scale-[0.99] before:pointer-events-none before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-l before:from-transparent before:via-brand-warm/75 before:to-transparent after:pointer-events-none after:absolute after:-left-12 after:-top-12 after:size-36 after:rounded-full after:blur-2xl ${
        variants[variant]
      } ${accentClasses[accent]} ${
        hover
          ? "hover:-translate-y-1 hover:shadow-[0_32px_96px_rgba(23,72,58,0.14)] active:translate-y-0"
          : ""
      } ${className}`}
    >
      {icon || title || description || meta || action ? (
        <div className="relative p-5 sm:p-6">
          <span
            aria-hidden="true"
            className="absolute -right-6 top-6 h-14 w-1 rounded-full bg-brand-warm/38 opacity-70"
          />
          {icon ? <div>{icon}</div> : null}
          {meta ? (
            <div className="mb-3 text-sm font-extrabold text-brand-calm">
              {meta}
            </div>
          ) : null}
          {title ? (
            <h3 className="mt-5 text-xl font-extrabold leading-8 text-current">
              {title}
            </h3>
          ) : null}
          {description ? (
            <p className="mt-3 leading-8 text-brand-calm">{description}</p>
          ) : null}
          {action ? <div className="mt-5">{action}</div> : null}
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export { IconBadge };
