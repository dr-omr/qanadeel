import Image from "next/image";
import {
  BadgeCheck,
  Clock,
  GraduationCap,
  MapPin,
  MessageCircle,
  Navigation,
  ReceiptText,
  School,
} from "lucide-react";
import { IconBadge } from "@/components/IconBadge";
import { SmartActionButton } from "@/components/SmartActionButton";
import { schoolInfo } from "@/data/school-info";
import { buildWhatsappMessage, buildWhatsappUrl } from "@/lib/whatsapp";

const heroStats = [
  { label: "الموقع", value: schoolInfo.address, icon: MapPin },
  { label: "الدوام", value: "٦:٣٠ صباحًا - ١٢:٣٠ ظهرًا", icon: Clock },
  { label: "الرسوم", value: schoolInfo.tuitionFees.amount, icon: ReceiptText },
  { label: "المراحل", value: "روضة وتمهيدي", icon: GraduationCap },
];

export function Hero() {
  const whatsappMessage = buildWhatsappMessage({
    schoolName: schoolInfo.shortName,
    requestType: "استفسار",
    message: "أرغب بالتواصل مع إدارة الروضة.",
  });
  const whatsappUrl = buildWhatsappUrl(
    schoolInfo.whatsappInternational,
    whatsappMessage,
  );

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#F7F1E6_0%,#fffaf0_52%,#F7F1E6_100%)] px-4 pb-12 pt-4 sm:px-6 lg:min-h-[calc(100svh-80px)] lg:bg-brand-deep lg:px-8 lg:py-0"
    >
      <div className="absolute inset-0 -z-30 hidden lg:block">
        <Image
          src={schoolInfo.heroImagePath}
          alt="واجهة روضة قناديل العلم الخاصة للتعليم المبكر في صحار"
          fill
          preload
          sizes="100vw"
          quality={85}
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 -z-20 hidden bg-[linear-gradient(90deg,rgba(23,72,58,0.08)_0%,rgba(23,72,58,0.18)_38%,rgba(23,72,58,0.78)_100%)] lg:block" />
      <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(0deg,rgba(31,42,36,0.88)_0%,rgba(31,42,36,0.38)_34%,rgba(31,42,36,0.02)_72%)] lg:block" />

      <div className="mx-auto max-w-7xl lg:flex lg:min-h-[calc(100svh-80px)] lg:flex-col lg:justify-end lg:pb-14 lg:pt-28">
        <div className="lg:hidden">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-2 shadow-[0_28px_90px_rgba(23,72,58,0.18)] backdrop-blur-xl">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.65rem] bg-brand-deep">
              <Image
                src={schoolInfo.heroMobileImagePath}
                alt="واجهة روضة قناديل العلم الخاصة للتعليم المبكر في صحار"
                fill
                preload
                sizes="100vw"
                quality={85}
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,72,58,0.05)_0%,rgba(23,72,58,0)_50%,rgba(23,72,58,0.22)_100%)]" />
              <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
                <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/65 bg-white/88 px-3 text-xs font-extrabold text-brand-deep shadow-sm backdrop-blur">
                  <BadgeCheck className="size-4" aria-hidden="true" />
                  الموقع الرسمي
                </span>
                <span className="inline-flex min-h-9 items-center rounded-full bg-brand-deep/90 px-3 text-xs font-extrabold text-white shadow-sm backdrop-blur">
                  {schoolInfo.country}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-right text-brand-deep">
            <p className="text-sm font-extrabold text-brand-calm">
              {schoolInfo.shortName}
            </p>
            <h1 className="mt-3 text-[clamp(2rem,10vw,3rem)] font-extrabold leading-[1.24] tracking-normal">
              {schoolInfo.heroTitle}
            </h1>
            <p className="mt-4 text-base leading-8 text-brand-calm">
              {schoolInfo.heroDescription}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {heroStats.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.35rem] border border-brand-line bg-white/88 p-3 shadow-[0_12px_36px_rgba(23,72,58,0.09)]"
              >
                <IconBadge icon={item.icon} size="sm" tone="beige" />
                <p className="mt-3 text-[0.72rem] font-extrabold text-brand-calm">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-extrabold leading-6 text-brand-deep">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3">
            <SmartActionButton
              href={whatsappUrl}
              external
              icon={MessageCircle}
              variant="primary"
              className="min-h-[52px]"
            >
              تواصل واتساب
            </SmartActionButton>
            <div className="grid grid-cols-2 gap-3">
              <SmartActionButton
                href={schoolInfo.mapUrl}
                external
                icon={Navigation}
                variant="secondary"
                className="min-h-[52px] px-3"
              >
                فتح الخريطة
              </SmartActionButton>
              <SmartActionButton
                href="/admission"
                icon={School}
                variant="outline"
                className="min-h-[52px] px-3"
              >
                تفاصيل التسجيل
              </SmartActionButton>
            </div>
          </div>
        </div>

        <div className="hidden max-w-4xl text-right text-white lg:block">
          <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/35 bg-white/14 px-4 py-2 text-sm font-extrabold text-[#fbf4df] shadow-sm backdrop-blur">
            <BadgeCheck className="size-4" aria-hidden="true" />
            الموقع الرسمي في {schoolInfo.country}
          </div>
          <p className="text-sm font-extrabold text-brand-warm">
            {schoolInfo.shortName}
          </p>
          <h1 className="mt-3 max-w-4xl text-6xl font-extrabold leading-[1.22] tracking-normal drop-shadow-[0_10px_28px_rgba(0,0,0,0.24)]">
            {schoolInfo.heroTitle}
          </h1>
          <p className="mt-5 max-w-3xl text-xl leading-9 text-[#fff8e9] drop-shadow-[0_8px_20px_rgba(0,0,0,0.18)]">
            {schoolInfo.heroDescription}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <SmartActionButton
              href={whatsappUrl}
              external
              icon={MessageCircle}
              variant="gold"
              className="min-w-40"
            >
              تواصل واتساب
            </SmartActionButton>
            <SmartActionButton
              href={schoolInfo.mapUrl}
              external
              icon={Navigation}
              variant="secondary"
              className="border-white/45 bg-white/12 text-white hover:bg-white/20"
            >
              فتح الخريطة
            </SmartActionButton>
            <SmartActionButton
              href="/admission"
              icon={School}
              variant="outline"
              className="border-white/45 text-white hover:bg-white/12"
            >
              تفاصيل التسجيل
            </SmartActionButton>
          </div>
        </div>

        <div className="mt-10 hidden grid-cols-4 gap-3 lg:grid">
          {heroStats.map((item) => (
            <div
              key={item.label}
              className="group rounded-[1.75rem] border border-white/28 bg-white/16 p-4 text-white shadow-[0_24px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/20"
            >
              <IconBadge icon={item.icon} tone="glass" size="md" />
              <p className="mt-4 text-xs font-extrabold text-[#f7ead0]">
                {item.label}
              </p>
              <p className="mt-1 text-lg font-extrabold leading-7">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
