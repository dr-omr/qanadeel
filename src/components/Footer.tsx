import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { schoolInfo } from "@/data/school-info";

/* ═══════════════════════════════════════════════════════════
   NAV COLUMNS
   ═══════════════════════════════════════════════════════════ */
const navColumns = [
  {
    title: "الروضة",
    links: [
      { label: "الرئيسية",  href: "/" },
      { label: "عن الروضة", href: "/about" },
      { label: "المعرض",    href: "/gallery" },
    ],
  },
  {
    title: "الخدمات",
    links: [
      { label: "التسجيل",    href: "/admission" },
      { label: "الرسوم",     href: "/fees" },
      { label: "السياسات",   href: "/policies" },
      { label: "تواصل معنا", href: "/contact" },
    ],
  },
];

const trustBadges = [
  { icon: "🏛️", text: "مرخصة من وزارة التربية" },
  { icon: "🛡️", text: "بيئة آمنة ومراقبة" },
  { icon: "✅", text: "معايير جودة معتمدة" },
];

/* ═══════════════════════════════════════════════════════════
   SOCIAL ICON BUTTON
   ═══════════════════════════════════════════════════════════ */
function SocialButton({
  href,
  label,
  icon: Icon,
  hoverClass,
  external = true,
}: {
  href: string;
  label: string;
  icon: typeof Phone;
  hoverClass: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`flex size-10 items-center justify-center rounded-xl bg-white/6 ring-1 ring-white/10 text-white/60 transition-all duration-300 hover:ring-white/20 ${hoverClass}`}
    >
      <Icon className="size-4" aria-hidden="true" />
    </a>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-brand-deep text-white">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -left-48 -top-48 size-96 rounded-full bg-emerald-700/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 size-72 rounded-full bg-brand-warm/6 blur-[100px]" />

      {/* Top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-brand-warm/25 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6 lg:px-8">

        {/* ═══════════════════════════════════════
            MAIN GRID — 4 columns
            ═══════════════════════════════════════ */}
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">

          {/* ── Brand column ── */}
          <div>
            <div className="inline-flex rounded-2xl bg-white/8 p-3 ring-1 ring-white/10 backdrop-blur-sm">
              <Image
                src={schoolInfo.logoPath}
                alt={schoolInfo.officialName}
                width={200}
                height={76}
                className="h-12 w-auto object-contain"
              />
            </div>

            <h2 className="mt-5 text-base font-extrabold leading-7">
              {schoolInfo.officialName}
            </h2>
            <p className="mt-2 max-w-[22rem] text-xs leading-7 text-white/40">
              {schoolInfo.disclosureText}
            </p>

            {/* Social icon buttons */}
            <div className="mt-5 flex gap-2">
              <SocialButton
                href={`tel:${schoolInfo.phone}`}
                label="اتصل"
                icon={Phone}
                hoverClass="hover:bg-white/12 hover:text-brand-warm"
                external={false}
              />
              <SocialButton
                href={`https://wa.me/${schoolInfo.whatsappInternational}`}
                label="واتساب"
                icon={MessageCircle}
                hoverClass="hover:bg-[#25D366]/20 hover:text-[#25D366]"
              />
              <SocialButton
                href={`mailto:${schoolInfo.email}`}
                label="بريد إلكتروني"
                icon={Mail}
                hoverClass="hover:bg-white/12 hover:text-brand-warm"
              />
            </div>
          </div>

          {/* ── Nav columns ── */}
          {navColumns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[0.65rem] font-extrabold uppercase tracking-[0.15em] text-brand-warm/55">
                {col.title}
              </h3>
              <nav className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm font-semibold text-white/50 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}

          {/* ── Contact column ── */}
          <div>
            <h3 className="text-[0.65rem] font-extrabold uppercase tracking-[0.15em] text-brand-warm/55">
              معلومات التواصل
            </h3>
            <div className="mt-5 space-y-3.5 text-sm text-white/50">
              <a href={`tel:${schoolInfo.phone}`} className="flex items-center gap-2 transition hover:text-white">
                <Phone className="size-3.5 shrink-0" aria-hidden="true" />
                {schoolInfo.phone}
              </a>
              <a href={`https://wa.me/${schoolInfo.whatsappInternational}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition hover:text-[#25D366]">
                <MessageCircle className="size-3.5 shrink-0" aria-hidden="true" />
                {schoolInfo.whatsapp}
              </a>
              <a href={`mailto:${schoolInfo.email}`} className="flex items-center gap-2 transition hover:text-white">
                <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                {schoolInfo.email}
              </a>
              <a href={schoolInfo.mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 transition hover:text-white">
                <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                <span className="leading-6">{schoolInfo.address}</span>
              </a>
              <p className="text-xs text-white/25">{schoolInfo.workingHours}</p>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            MAP EMBED
            ═══════════════════════════════════════ */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/8 shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3633.9576!2d56.7312!3d24.3641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z2YXYr9ix2LPYqSDZgtmG2KfYr9mK2YQg2KfZhNi52YTZhQ!5e0!3m2!1sar!2som"
            width="100%"
            height="180"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="موقع مدرسة قناديل العلم (مرحلة الروضة)"
            className="grayscale-[25%] opacity-75 transition-opacity duration-500 hover:opacity-90"
          />
        </div>

        {/* ═══════════════════════════════════════
            BOTTOM BAR
            ═══════════════════════════════════════ */}
        <div className="mt-8 border-t border-white/8 pt-6">

          {/* Trust badges */}
          <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
            {trustBadges.map((b) => (
              <div
                key={b.text}
                className="flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-3.5 py-1.5"
              >
                <span className="text-xs">{b.icon}</span>
                <span className="text-[0.65rem] font-bold text-white/35">{b.text}</span>
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div className="flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-start">
            <p className="text-[0.7rem] text-white/30">
              © {year} {schoolInfo.shortName}. جميع الحقوق محفوظة.
            </p>
            <p className="text-[0.7rem] text-white/20">
              سلطنة عمان — صحار — التعليم المبكر
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
