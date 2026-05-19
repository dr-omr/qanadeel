"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { schoolInfo } from "@/data/school-info";

const mobileDrawerLinks = schoolInfo.navLinks.filter(
  (link) => !["/", "/contact"].includes(link.href),
);

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition ${
        isScrolled
          ? "border-brand-line bg-brand-ivory/88 shadow-[0_14px_36px_rgba(16,64,45,0.12)]"
          : "border-transparent bg-brand-ivory/78"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:px-6 lg:h-20 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 text-brand-deep"
          aria-label={schoolInfo.shortName}
          onClick={() => setIsMenuOpen(false)}
        >
          <Image
            src={schoolInfo.logoMarkPath}
            alt=""
            width={56}
            height={56}
            className="size-10 rounded-2xl border border-brand-line bg-white object-contain p-1 shadow-sm sm:size-12 lg:size-14"
            preload
          />
          <span className="grid min-w-0">
            <span className="truncate text-base font-extrabold sm:hidden">
              قناديل العلم
            </span>
            <span className="hidden truncate text-base font-extrabold sm:block sm:text-lg">
              {schoolInfo.shortName}
            </span>
            <span className="hidden truncate text-xs font-bold text-brand-calm sm:block">
              للتعليم المبكر
            </span>
          </span>
        </Link>

        <nav
          aria-label="التنقل الرئيسي"
          className="scrollbar-none hidden items-center gap-1 overflow-x-auto whitespace-nowrap rounded-full border border-brand-line bg-white/72 p-1 text-sm font-bold text-brand-calm shadow-sm lg:flex"
        >
          {schoolInfo.navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 transition ${
                  isActive
                    ? "bg-brand-deep text-white shadow-sm"
                    : "text-brand-calm hover:bg-brand-paper hover:text-brand-deep"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="hidden h-11 items-center justify-center gap-2 rounded-full bg-brand-deep px-5 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#11382d] md:inline-flex"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            تواصل معنا
          </Link>
          <button
            type="button"
            aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((value) => !value)}
            className="inline-flex size-10 items-center justify-center rounded-full border border-brand-line bg-white text-brand-deep shadow-sm transition hover:bg-brand-paper sm:size-11 lg:hidden"
          >
            {isMenuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-brand-line bg-brand-ivory/96 px-4 py-4 shadow-[0_18px_40px_rgba(16,64,45,0.14)] lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            <p className="px-1 text-xs font-extrabold text-brand-calm">
              روابط إضافية
            </p>
            {mobileDrawerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-2xl px-4 py-3 text-sm font-extrabold transition ${
                  pathname === link.href
                    ? "bg-brand-deep text-white"
                    : "bg-white text-brand-deep hover:bg-brand-paper"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-brand-deep px-4 text-sm font-extrabold text-white"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              تواصل معنا
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
