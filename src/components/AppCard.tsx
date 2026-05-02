import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { IconBadge } from "./IconBadge";

type AppCardVariant =
  | "default"
  | "elevated"
  | "glass"
  | "feature"
  | "fee"
  | "contact"
  | "policy"
  | "mini";

type AppCardProps = {
  icon?: LucideIcon;
  title?: ReactNode;
  description?: ReactNode;
  metadata?: ReactNode;
  action?: ReactNode;
  href?: string;
  external?: boolean;
  highlight?: ReactNode;
  children?: ReactNode;
  className?: string;
  variant?: AppCardVariant;
  iconTone?: "emerald" | "beige" | "gold" | "glass" | "danger" | "neutral";
};

const variants: Record<AppCardVariant, string> = {
  default:
    "border-brand-line/80 bg-white/88 text-brand-deep shadow-[0_16px_48px_rgba(23,72,58,0.08)]",
  elevated:
    "border-brand-line/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(247,241,230,0.78))] text-brand-deep shadow-[0_20px_64px_rgba(23,72,58,0.10)]",
  glass:
    "border-white/25 bg-white/12 text-white shadow-[0_20px_64px_rgba(0,0,0,0.14)] backdrop-blur-xl",
  feature:
    "border-brand-line/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(167,191,168,0.15))] text-brand-deep shadow-[0_18px_56px_rgba(23,72,58,0.08)]",
  fee: "border-brand-deep/12 bg-brand-deep text-white shadow-[0_22px_72px_rgba(23,72,58,0.22)]",
  contact:
    "border-brand-line/80 bg-white/92 text-brand-deep shadow-[0_16px_52px_rgba(23,72,58,0.08)]",
  policy:
    "border-brand-line/80 bg-brand-ivory/92 text-brand-deep shadow-[0_14px_44px_rgba(23,72,58,0.06)]",
  mini: "border-brand-line/80 bg-[#fffcf5]/92 text-brand-deep shadow-[0_10px_30px_rgba(23,72,58,0.05)]",
};

function CardShell({
  children,
  className,
  href,
  external,
}: {
  children: ReactNode;
  className: string;
  href?: string;
  external?: boolean;
}) {
  if (!href) return <article className={className}>{children}</article>;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function AppCard({
  icon,
  title,
  description,
  metadata,
  action,
  href,
  external = false,
  highlight,
  children,
  className = "",
  variant = "default",
  iconTone = variant === "fee" || variant === "glass" ? "glass" : "emerald",
}: AppCardProps) {
  const clickable = href ? "hover:-translate-y-1 active:translate-y-0" : "";

  return (
    <CardShell
      href={href}
      external={external}
      className={`group relative overflow-hidden rounded-[1.75rem] border p-4 shadow-sm transition-all duration-300 active:scale-[0.99] sm:rounded-[2rem] sm:p-5 before:pointer-events-none before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-gradient-to-l before:from-transparent before:via-brand-warm/60 before:to-transparent after:pointer-events-none after:absolute after:-left-10 after:-top-10 after:size-28 after:rounded-full after:bg-brand-warm/15 after:blur-2xl ${variants[variant]} ${clickable} ${className}`}
    >
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute -right-5 top-1 h-12 w-0.5 rounded-full bg-brand-warm/30 opacity-60 transition-all group-hover:h-16"
        />
        <div className="flex items-start justify-between gap-3">
          {icon ? <IconBadge icon={icon} tone={iconTone} size="sm" className="sm:size-12 sm:rounded-2xl" /> : null}
          {metadata ? (
            <div className="rounded-full border border-current/8 bg-white/12 px-2.5 py-0.5 text-[0.7rem] font-extrabold text-current/70">
              {metadata}
            </div>
          ) : null}
        </div>
        {highlight ? <div className="mt-4">{highlight}</div> : null}
        {title ? (
          <h3 className="mt-4 text-lg font-extrabold leading-[1.6] text-current sm:text-xl sm:leading-8">
            {title}
          </h3>
        ) : null}
        {description ? (
          <p
            className={`mt-2.5 text-[0.9rem] leading-[1.85] sm:text-base sm:leading-8 ${
              variant === "fee" || variant === "glass"
                ? "text-white/80"
                : "text-brand-calm"
            }`}
          >
            {description}
          </p>
        ) : null}
        {children}
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </CardShell>
  );
}
