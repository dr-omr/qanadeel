"use client";

import type { LucideIcon } from "lucide-react";
import {
  ClipboardCheck,
  Home,
  Image as ImageIcon,
  MessageCircle,
  ReceiptText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { schoolInfo } from "@/data/school-info";
import { buildWhatsappMessage, buildWhatsappUrl } from "@/lib/whatsapp";

const navItems: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "الرئيسية", href: "/",         icon: Home },
  { label: "الرسوم",   href: "/fees",      icon: ReceiptText },
  // WhatsApp FAB goes in the middle (index 2) — rendered separately
  { label: "المعرض",  href: "/gallery",   icon: ImageIcon },
  { label: "التسجيل", href: "/admission", icon: ClipboardCheck },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  const whatsappUrl = buildWhatsappUrl(
    schoolInfo.whatsappInternational,
    buildWhatsappMessage({
      schoolName: schoolInfo.shortName,
      requestType: "استفسار",
      message: "أرغب بالتواصل مع إدارة الروضة.",
    }),
  );

  return (
    <nav
      aria-label="تنقل الجوال"
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-[calc(8px+env(safe-area-inset-bottom))] lg:hidden"
    >
      <div className="relative flex h-[66px] items-stretch overflow-visible rounded-[1.8rem] border border-white/50 bg-white/85 shadow-[0_-8px_40px_rgba(16,64,45,0.10)] backdrop-blur-2xl">

        {/* ── Left nav items ── */}
        {navItems.slice(0, 2).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className="relative flex flex-1 flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-90 select-none"
            >
              {isActive && (
                <span
                  className="absolute inset-x-2 inset-y-2 rounded-2xl bg-brand-deep/10"
                  style={{ animation: "scaleIn 0.25s ease" }}
                />
              )}
              <Icon
                className={`relative z-10 transition-all duration-200 ${isActive ? "text-brand-deep" : "text-brand-calm/55"}`}
                size={isActive ? 21 : 20}
                strokeWidth={isActive ? 2.4 : 1.6}
                aria-hidden="true"
              />
              <span className={`relative z-10 text-[0.55rem] font-extrabold leading-none transition-all duration-200 ${isActive ? "text-brand-deep" : "text-brand-calm/45"}`}>
                {item.label}
              </span>
              {/* Active dot */}
              {isActive && (
                <span className="absolute bottom-1.5 size-1 rounded-full bg-brand-deep" style={{ animation: "scaleIn 0.3s ease" }} />
              )}
            </Link>
          );
        })}

        {/* ── Center FAB — WhatsApp ── */}
        <div className="flex flex-1 items-center justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تواصل واتساب"
            className="absolute -top-5 flex size-[52px] items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-[0_6px_20px_rgba(37,211,102,0.35)] ring-4 ring-white/90 transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_28px_rgba(37,211,102,0.45)] active:scale-95"
          >
            <MessageCircle size={24} strokeWidth={2} aria-hidden="true" />
          </a>
        </div>

        {/* ── Right nav items ── */}
        {navItems.slice(2).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className="relative flex flex-1 flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-90 select-none"
            >
              {isActive && (
                <span
                  className="absolute inset-x-2 inset-y-2 rounded-2xl bg-brand-deep/10"
                  style={{ animation: "scaleIn 0.25s ease" }}
                />
              )}
              <Icon
                className={`relative z-10 transition-all duration-200 ${isActive ? "text-brand-deep" : "text-brand-calm/55"}`}
                size={isActive ? 21 : 20}
                strokeWidth={isActive ? 2.4 : 1.6}
                aria-hidden="true"
              />
              <span className={`relative z-10 text-[0.55rem] font-extrabold leading-none transition-all duration-200 ${isActive ? "text-brand-deep" : "text-brand-calm/45"}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1.5 size-1 rounded-full bg-brand-deep" style={{ animation: "scaleIn 0.3s ease" }} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
