"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone, X, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { schoolInfo } from "@/data/school-info";
import { buildWhatsappMessage, buildWhatsappUrl } from "@/lib/whatsapp";

const navLinks = [
  { href: "/",          label: "الرئيسية",   emoji: "🏠" },
  { href: "/about",     label: "عن الروضة",  emoji: "📖" },
  { href: "/gallery",   label: "المعرض",     emoji: "🖼️" },
  { href: "/fees",      label: "الرسوم",     emoji: "💰" },
  { href: "/admission", label: "التسجيل",    emoji: "📋" },
  { href: "/policies",  label: "السياسات",   emoji: "📜" },
  { href: "/contact",   label: "تواصل معنا", emoji: "📞" },
];

/* ─── Mobile Full-Screen Menu ─── */
function MobileMenu({
  open,
  onClose,
  pathname,
  whatsappUrl,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  whatsappUrl: string;
}) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-[6px] lg:hidden"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.35s ease",
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-up panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="قائمة التنقل"
        className="fixed inset-x-0 bottom-0 z-[80] rounded-t-[2.5rem] bg-white shadow-[0_-20px_60px_rgba(23,72,58,0.15)] lg:hidden"
        style={{
          transform: open ? "translateY(0)" : "translateY(105%)",
          transition: "transform 0.4s cubic-bezier(0.32,0.72,0,1)",
          maxHeight: "92svh",
          overflowY: "auto",
          paddingBottom: "calc(20px + env(safe-area-inset-bottom))",
        }}
      >
        {/* Handle bar */}
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-brand-line/40" />

        {/* Header row */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <div>
            <p className="text-base font-extrabold text-brand-deep">قناديل العلم</p>
            <p className="text-[0.68rem] font-bold text-brand-calm/60">للتعليم المبكر — صحار</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق القائمة"
            className="flex size-10 items-center justify-center rounded-2xl border border-brand-line/40 bg-brand-ivory text-brand-calm transition hover:bg-brand-deep hover:text-white active:scale-90"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-6 my-4 h-px bg-brand-line/30" />

        {/* Nav links */}
        <nav className="px-4" aria-label="قائمة الصفحات">
          {navLinks.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`group flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-200 active:scale-[0.98] ${
                  isActive
                    ? "bg-brand-deep text-white"
                    : "text-brand-deep hover:bg-brand-ivory"
                }`}
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? "translateX(0)" : "translateX(20px)",
                  transition: `opacity 0.35s ${0.06 + i * 0.05}s ease, transform 0.35s ${0.06 + i * 0.05}s cubic-bezier(0.16,1,0.3,1), background-color 0.2s, color 0.2s`,
                }}
              >
                <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-lg transition-colors ${isActive ? "bg-white/15" : "bg-brand-ivory"}`}>
                  {link.emoji}
                </span>
                <span className="flex-1 text-sm font-extrabold">{link.label}</span>
                {isActive && (
                  <span className="flex size-2 rounded-full bg-brand-warm" />
                )}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="opacity-30">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-6 my-4 h-px bg-brand-line/30" />

        {/* Contact actions */}
        <div className="space-y-3 px-4 pb-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] py-4 text-sm font-extrabold text-white shadow-[0_8px_28px_rgba(37,211,102,0.25)] transition hover:bg-[#20c05c] active:scale-[0.98]"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.4s 0.42s ease, transform 0.4s 0.42s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <MessageCircle size={18} aria-hidden="true" />
            تواصل واتساب
          </a>
          <a
            href={`tel:${schoolInfo.phone}`}
            onClick={onClose}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-brand-line/50 bg-brand-ivory py-4 text-sm font-extrabold text-brand-deep transition hover:bg-brand-deep hover:text-white active:scale-[0.98]"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.4s 0.48s ease, transform 0.4s 0.48s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <Phone size={16} aria-hidden="true" />
            اتصل بنا مباشرة
          </a>
        </div>

        {/* Info strip */}
        <div
          className="mx-4 mt-4 rounded-2xl border border-brand-line/30 bg-brand-ivory px-4 py-3"
          style={{ opacity: open ? 1 : 0, transition: "opacity 0.4s 0.55s ease" }}
        >
          <p className="text-center text-[0.65rem] font-bold text-brand-calm/70">
            🕐 ساعات الدوام: ٦:٣٠ صباحاً – ١٢:٣٠ ظهراً
          </p>
          <p className="mt-1 text-center text-[0.65rem] font-bold text-brand-calm/50">
            📍 {schoolInfo.address}
          </p>
        </div>
      </div>
    </>
  );
}

/* ─── Main Header ─── */
export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const whatsappUrl = buildWhatsappUrl(
    schoolInfo.whatsappInternational,
    buildWhatsappMessage({
      schoolName: schoolInfo.shortName,
      requestType: "استفسار",
      message: "أرغب بالتواصل مع إدارة الروضة.",
    }),
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 12);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? (scrollY / docH) * 100 : 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          isScrolled
            ? "border-brand-deep/10 bg-white/95 shadow-[0_4px_20px_rgba(23,72,58,0.08)] backdrop-blur-xl"
            : "border-transparent bg-white/70 backdrop-blur-md"
        }`}
      >
        {/* Scroll progress */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-brand-line/10">
          <div
            className="h-full rounded-full bg-gradient-to-l from-brand-deep via-brand-warm to-brand-deep transition-[width] duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <div className="mx-auto flex h-[3.5rem] max-w-7xl items-center justify-between gap-3 px-4 sm:h-[3.75rem] sm:px-6 lg:h-[4.5rem] lg:px-8">

          {/* Logo */}
          <Link href="/" className="flex min-w-0 items-center gap-2.5 text-brand-deep" aria-label={schoolInfo.shortName}>
            <div className="relative flex size-10 shrink-0 items-center justify-center rounded-2xl border border-brand-warm/25 bg-gradient-to-br from-brand-ivory to-white p-1 shadow-[0_2px_8px_rgba(23,72,58,0.08)] sm:size-11 lg:size-12">
              <Image
                src={schoolInfo.logoMarkPath}
                alt=""
                width={48}
                height={48}
                className="size-full object-contain"
                priority
              />
            </div>
            <span className="grid min-w-0">
              <span className="truncate text-[0.88rem] font-extrabold leading-tight text-brand-deep sm:text-[0.95rem] lg:text-lg">
                قناديل العلم
              </span>
              <span className="truncate text-[0.6rem] font-bold text-brand-calm/60 sm:text-[0.65rem]">
                للتعليم المبكر — صحار
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="التنقل الرئيسي"
            className="scrollbar-none hidden items-center gap-0.5 overflow-x-auto whitespace-nowrap rounded-full border border-brand-line/40 bg-brand-ivory/70 p-1 text-sm font-bold text-brand-calm shadow-sm backdrop-blur-sm lg:flex"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 transition-all duration-200 ${
                    isActive
                      ? "bg-brand-deep text-white shadow-[0_2px_8px_rgba(23,72,58,0.15)]"
                      : "text-brand-calm hover:bg-white hover:text-brand-deep"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Desktop CTA */}
            <Link
              href="/contact"
              className="hidden h-11 items-center justify-center gap-2 rounded-full bg-brand-deep px-5 text-sm font-extrabold text-white shadow-[0_4px_12px_rgba(23,72,58,0.15)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#11382d] hover:shadow-[0_8px_20px_rgba(23,72,58,0.2)] active:scale-[0.97] lg:inline-flex"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              تواصل معنا
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="فتح القائمة"
              aria-expanded={menuOpen}
              className="relative flex size-10 items-center justify-center rounded-2xl border border-brand-line/40 bg-white text-brand-deep shadow-sm transition hover:bg-brand-ivory active:scale-90 lg:hidden"
            >
              <Menu size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-up menu */}
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        pathname={pathname}
        whatsappUrl={whatsappUrl}
      />
    </>
  );
}
