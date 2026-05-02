import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type SmartActionButtonProps = {
  href: string;
  children: ReactNode;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "glass" | "outline" | "gold";
  external?: boolean;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;

const variants = {
  primary:
    "bg-brand-deep text-white shadow-[0_12px_32px_rgba(23,72,58,0.20)] hover:bg-[#11382d] hover:shadow-[0_16px_40px_rgba(23,72,58,0.25)]",
  secondary:
    "border border-brand-line bg-white/90 text-brand-deep shadow-[0_8px_24px_rgba(23,72,58,0.06)] hover:bg-brand-paper hover:shadow-[0_12px_30px_rgba(23,72,58,0.10)]",
  glass:
    "border border-white/25 bg-white/12 text-white shadow-[0_12px_32px_rgba(0,0,0,0.12)] backdrop-blur-lg hover:bg-white/20",
  outline:
    "border border-brand-deep/18 bg-transparent text-brand-deep hover:bg-brand-deep/5",
  gold:
    "bg-brand-warm text-brand-deep shadow-[0_12px_32px_rgba(217,195,154,0.25)] hover:bg-[#e6cfaa] hover:shadow-[0_16px_38px_rgba(217,195,154,0.32)]",
};

export function SmartActionButton({
  href,
  children,
  icon: Icon,
  variant = "primary",
  external = false,
  className = "",
  ...props
}: SmartActionButtonProps) {
  const classes = `inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-extrabold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${variants[variant]} ${className}`;

  const content = (
    <>
      {Icon ? <Icon className="size-[1.15rem]" strokeWidth={2.3} aria-hidden="true" /> : null}
      <span>{children}</span>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...props}
      >
        {content}
      </a>
    );
  }

  if (href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
