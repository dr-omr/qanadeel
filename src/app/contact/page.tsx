import type { Metadata } from "next";
import { ContactWizard } from "@/components/ContactWizard";
import { FaqSection } from "@/components/FaqSection";
import { schoolInfo } from "@/data/school-info";
import { Mail, MapPin, MessageCircle, Phone, Clock } from "lucide-react";
import Link from "next/link";
import { buildWhatsappMessage, buildWhatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: `تواصل معنا | ${schoolInfo.shortName}`,
  description:
    "تواصل مع مدرسة قناديل العلم (مرحلة الروضة) عبر نموذج خطوات سهل — بريد إلكتروني وواتساب في آنٍ واحد.",
};

const contactCards = [
  {
    icon: Phone,
    label: "اتصال مباشر",
    value: schoolInfo.phone,
    href: `tel:${schoolInfo.phone}`,
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: MessageCircle,
    label: "واتساب",
    value: schoolInfo.whatsapp,
    href: buildWhatsappUrl(
      schoolInfo.whatsappInternational,
      buildWhatsappMessage({ schoolName: schoolInfo.shortName, message: "أرغب بالاستفسار." }),
    ),
    external: true,
    color: "bg-green-50 text-green-700",
  },
  {
    icon: Mail,
    label: "البريد الإلكتروني",
    value: schoolInfo.email,
    href: `mailto:${schoolInfo.email}`,
    color: "bg-sky-50 text-sky-700",
  },
  {
    icon: MapPin,
    label: "الموقع",
    value: schoolInfo.address,
    href: schoolInfo.mapUrl,
    external: true,
    color: "bg-amber-50 text-amber-700",
  },
  {
    icon: Clock,
    label: "أوقات الدوام",
    value: schoolInfo.workingHours,
    href: undefined,
    color: "bg-brand-ivory text-brand-calm",
  },
];

export default function ContactPage() {
  return (
    <main className="flex-1">
      {/* ── Hero ── */}
      <section className="bg-brand-deep px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-warm/30 bg-brand-warm/10 px-4 py-1.5 text-xs font-extrabold text-brand-warm">
            <MessageCircle className="size-3.5" aria-hidden="true" />
            تواصل معنا
          </span>
          <h1 className="mt-5 text-[clamp(1.8rem,5vw,3rem)] font-extrabold leading-[1.3] text-white">
            نحن هنا للإجابة على كل أسئلتك
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/60">
            أرسل طلبك خلال دقيقة — سيصلنا عبر البريد وواتساب في آنٍ واحد.
          </p>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="bg-brand-ivory px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.4fr]">

          {/* Contact info cards */}
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-brand-deep">بيانات التواصل</h2>
            {contactCards.map((card) => {
              const Icon = card.icon;
              const inner = (
                <div className="flex items-center gap-4 rounded-[1.5rem] border border-brand-line/40 bg-white p-5 shadow-[0_4px_16px_rgba(23,72,58,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(23,72,58,0.10)]">
                  <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${card.color}`}>
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-brand-calm">{card.label}</p>
                    <p className="mt-0.5 truncate text-sm font-extrabold text-brand-deep">{card.value}</p>
                  </div>
                </div>
              );
              if (!card.href) return <div key={card.label}>{inner}</div>;
              return (
                <Link
                  key={card.label}
                  href={card.href}
                  target={card.external ? "_blank" : undefined}
                  rel={card.external ? "noopener noreferrer" : undefined}
                >
                  {inner}
                </Link>
              );
            })}

            {/* Map embed hint */}
            <a
              href={schoolInfo.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 rounded-[1.5rem] border border-brand-line/40 bg-brand-deep p-5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#11382d]"
            >
              <MapPin className="size-4" aria-hidden="true" />
              افتح الموقع على خرائط Google
            </a>
          </div>

          {/* Wizard */}
          <div>
            <h2 className="mb-5 text-xl font-extrabold text-brand-deep">أرسل طلبك</h2>
            <ContactWizard />
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FaqSection />
    </main>
  );
}
