import type { LucideIcon } from "lucide-react";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
} from "lucide-react";
import Image from "next/image";
import { schoolInfo } from "@/data/school-info";
import { buildWhatsappMessage, buildWhatsappUrl } from "@/lib/whatsapp";
import { AppCard } from "./AppCard";
import { IconBadge, PremiumCard } from "./PremiumCard";
import { LeadForm } from "./LeadForm";
import { SectionHeader } from "./SectionHeader";
import { SmartActionButton } from "./SmartActionButton";

type ContactRow = {
  label: string;
  value: string;
  icon: LucideIcon;
  href?: string;
  external?: boolean;
};

type ContactSectionProps = {
  compact?: boolean;
};

export function ContactSection({ compact = false }: ContactSectionProps) {
  const quickMessage = buildWhatsappMessage({
    schoolName: schoolInfo.shortName,
    message: "أرغب بالتواصل مع الإدارة والاستفسار عن التسجيل.",
  });

  const contactRows: ContactRow[] = [
    {
      label: "رقم الهاتف",
      value: schoolInfo.phone,
      icon: Phone,
      href: `tel:${schoolInfo.phone}`,
    },
    {
      label: "واتساب",
      value: schoolInfo.whatsapp,
      icon: MessageCircle,
      href: buildWhatsappUrl(schoolInfo.whatsappInternational, quickMessage),
      external: true,
    },
    {
      label: "البريد الإلكتروني",
      value: schoolInfo.email,
      icon: Mail,
      href: `mailto:${schoolInfo.email}`,
    },
    {
      label: "العنوان",
      value: schoolInfo.address,
      icon: MapPin,
      href: schoolInfo.mapUrl,
      external: true,
    },
    { label: "أوقات الدوام", value: schoolInfo.workingHours, icon: Clock },
  ];

  return (
    <section
      id="contact"
      className="bg-brand-ivory px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="تواصل معنا"
          title="بيانات التواصل"
          description="يمكن التواصل مع الإدارة خلال أوقات الدوام الرسمية للاستفسار عن التسجيل والرسوم والسياسات."
          align="center"
        />

        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-4">
            {!compact ? (
              <PremiumCard className="p-2" hover={false}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.65rem]">
                  <Image
                    src={schoolInfo.heroImagePath}
                    alt="واجهة روضة قناديل العلم الخاصة للتعليم المبكر في صحار"
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-x-4 bottom-4 rounded-[1.25rem] border border-white/60 bg-white/90 p-4 shadow-[0_16px_38px_rgba(23,72,58,0.16)] backdrop-blur">
                    <div className="flex items-start gap-3">
                      <IconBadge size="sm" tone="gold">
                        <MapPin className="size-5" aria-hidden="true" />
                      </IconBadge>
                      <div>
                        <h3 className="text-base font-extrabold text-brand-deep">
                          موقع الروضة
                        </h3>
                        <p className="mt-1 text-sm font-bold leading-7 text-brand-calm">
                          تقع الروضة في {schoolInfo.address}، ويمكن فتح الخريطة
                          مباشرة للوصول بسهولة.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </PremiumCard>
            ) : null}

            <PremiumCard className="p-6" variant="fee">
              <div className="relative">
                <IconBadge tone="glass">
                  <MessageCircle className="size-6" aria-hidden="true" />
                </IconBadge>
                <h3 className="mt-5 text-2xl font-extrabold">
                  تواصل مباشر مع الإدارة
                </h3>
                <p className="mt-3 leading-8 text-[#f8f0df]">
                  اختر طريقة التواصل المناسبة أو أرسل رسالة واتساب جاهزة من
                  النموذج.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <a
                    href={buildWhatsappUrl(
                      schoolInfo.whatsappInternational,
                      quickMessage,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-extrabold text-brand-deep transition hover:bg-brand-paper"
                  >
                    <MessageCircle className="size-5" aria-hidden="true" />
                    واتساب
                  </a>
                  <a
                    href={`tel:${schoolInfo.phone}`}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/20 px-4 text-sm font-extrabold text-white transition hover:bg-white/10"
                  >
                    <Phone className="size-5" aria-hidden="true" />
                    اتصال
                  </a>
                  <a
                    href={schoolInfo.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/20 px-4 text-sm font-extrabold text-white transition hover:bg-white/10"
                  >
                    <Navigation className="size-5" aria-hidden="true" />
                    خرائط
                  </a>
                </div>
              </div>
            </PremiumCard>

            <div className="grid gap-4 sm:grid-cols-2">
              {contactRows.map((row) => {
                const Icon = row.icon;

                return (
                  <PremiumCard key={row.label} className="p-5" variant="contact">
                    <div className="flex items-start gap-3">
                      <IconBadge size="sm">
                        <Icon className="size-5" aria-hidden="true" />
                      </IconBadge>
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-brand-calm">
                          {row.label}
                        </p>
                        {row.href ? (
                          <a
                            href={row.href}
                            target={row.external ? "_blank" : undefined}
                            rel={
                              row.external ? "noopener noreferrer" : undefined
                            }
                            className="mt-2 block break-words text-base font-extrabold leading-8 text-brand-deep transition hover:text-brand-calm"
                          >
                            {row.value}
                          </a>
                        ) : (
                          <p className="mt-2 break-words text-base font-extrabold leading-8 text-brand-deep">
                            {row.value}
                          </p>
                        )}
                      </div>
                    </div>
                  </PremiumCard>
                );
              })}
            </div>

            {!compact ? (
              <AppCard
                variant="feature"
                icon={MapPin}
                iconTone="gold"
                title="موقع الروضة"
                description={`تقع الروضة في ${schoolInfo.address}. يمكن فتح الموقع مباشرة في خرائط جوجل للوصول بسهولة.`}
                action={
                  <div className="grid gap-3 sm:grid-cols-3">
                    <SmartActionButton
                      href={schoolInfo.mapUrl}
                      external
                      icon={Navigation}
                      variant="primary"
                      className="sm:col-span-2"
                    >
                      فتح في خرائط جوجل
                    </SmartActionButton>
                    <SmartActionButton
                      href={`mailto:${schoolInfo.email}`}
                      icon={Mail}
                      variant="secondary"
                    >
                      بريد
                    </SmartActionButton>
                  </div>
                }
              />
            ) : null}
          </div>

          <LeadForm compact={compact} />
        </div>
      </div>
    </section>
  );
}
