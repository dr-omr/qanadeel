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
    "border-brand-line bg-white/88 text-brand-deep shadow-[0_20px_60px_rgba(23,72,58,0.09)]",
  elevated:
    "border-brand-line bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(247,241,230,0.78))] text-brand-deep shadow-[0_28px_90px_rgba(23,72,58,0.13)]",
  glass:
    "border-white/30 bg-white/14 text-white shadow-[0_24px_78px_rgba(0,0,0,0.16)] backdrop-blur-xl",
  feature:
    "border-brand-line bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(167,191,168,0.18))] text-brand-deep shadow-[0_22px_72px_rgba(23,72,58,0.10)]",
  fee: "border-brand-deep/15 bg-brand-deep text-white shadow-[0_28px_90px_rgba(23,72,58,0.24)]",
  contact:
    "border-brand-line bg-white/92 text-brand-deep shadow-[0_20px_64px_rgba(23,72,58,0.10)]",
  policy:
    "border-brand-line bg-brand-ivory/92 text-brand-deep shadow-[0_18px_54px_rgba(23,72,58,0.08)]",
  mini: "border-brand-line bg-[#fffcf5]/92 text-brand-deep shadow-[0_12px_36px_rgba(23,72,58,0.07)]",
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
      className={`group relative overflow-hidden rounded-[2rem] border p-5 shadow-sm transition duration-300 active:scale-[0.99] sm:p-6 before:pointer-events-none before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-l before:from-transparent before:via-brand-warm/70 before:to-transparent after:pointer-events-none after:absolute after:-left-12 after:-top-12 after:size-36 after:rounded-full after:bg-brand-warm/18 after:blur-2xl ${variants[variant]} ${clickable} ${className}`}
    >
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute -right-6 top-1 h-16 w-1 rounded-full bg-brand-warm/40 opacity-70 transition group-hover:h-24"
        />
        <div className="flex items-start justify-between gap-4">
          {icon ? <IconBadge icon={icon} tone={iconTone} /> : null}
          {metadata ? (
            <div className="rounded-full border border-current/10 bg-white/14 px-3 py-1 text-xs font-extrabold text-current/75">
              {metadata}
            </div>
          ) : null}
        </div>
        {highlight ? <div className="mt-5">{highlight}</div> : null}
        {title ? (
          <h3 className="mt-5 text-xl font-extrabold leading-8 text-current">
            {title}
          </h3>
        ) : null}
        {description ? (
          <p
            className={`mt-3 leading-8 ${
              variant === "fee" || variant === "glass"
                ? "text-white/82"
                : "text-brand-calm"
            }`}
          >
            {description}
          </p>
        ) : null}
        {children}
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </CardShell>
  );
}
