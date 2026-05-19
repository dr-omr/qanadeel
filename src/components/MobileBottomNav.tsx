"use client";

import type { LucideIcon } from "lucide-react";
import {
  ClipboardCheck,
  Home,
  MessageCircle,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MobileNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const mobileNavItems: MobileNavItem[] = [
  { label: "الرئيسية", href: "/", icon: Home },
  { label: "الرسوم", href: "/fees", icon: ReceiptText },
  { label: "التسجيل", href: "/admission", icon: ClipboardCheck },
  { label: "السياسات", href: "/policies", icon: ShieldCheck },
  { label: "تواصل", href: "/contact", icon: MessageCircle },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="تنقل الجوال"
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2 lg:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1 rounded-full border border-white/72 bg-white/88 p-1.5 shadow-[0_-26px_80px_rgba(16,64,45,0.24)] ring-1 ring-brand-deep/5 backdrop-blur-2xl">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex min-h-[68px] flex-col items-center justify-center gap-1 rounded-full px-1 text-[0.68rem] font-extrabold transition duration-300 active:scale-95 ${
                isActive
                  ? "bg-brand-deep text-white shadow-[0_16px_38px_rgba(16,64,45,0.28)]"
                  : "text-brand-calm hover:bg-brand-paper hover:text-brand-deep"
              }`}
            >
              {isActive ? (
                <span className="absolute -top-1 size-2 rounded-full bg-brand-warm shadow-[0_0_18px_rgba(217,195,154,0.75)]" />
              ) : null}
              <Icon
                className={`transition ${
                  isActive ? "size-6" : "size-[1.375rem]"
                }`}
                strokeWidth={isActive ? 2.6 : 2.2}
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
