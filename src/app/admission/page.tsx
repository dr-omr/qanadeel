import type { Metadata } from "next";
import Image from "next/image";
import { ClipboardCheck, FileCheck2 } from "lucide-react";
import { AdmissionDocuments } from "@/components/AdmissionDocuments";
import { IconBadge, PremiumCard } from "@/components/PremiumCard";
import { LeadForm } from "@/components/LeadForm";
import { SectionHeader } from "@/components/SectionHeader";
import { schoolInfo } from "@/data/school-info";

export const metadata: Metadata = {
  title: `التسجيل | ${schoolInfo.shortName}`,
  description:
    "خطوات التسجيل والمستندات المطلوبة ونموذج واتساب لمدرسة قناديل العلم الخاصة للتعليم المبكر (مرحلة الروضة) في سلطنة عمان.",
};

export default function AdmissionPage() {
  return (
    <main className="flex-1">
      <section className="bg-brand-ivory px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-sm font-extrabold text-brand-calm">
              صفحة التسجيل
            </p>
            <h1 className="mt-3 text-[clamp(2rem,5vw,3.35rem)] font-extrabold leading-[1.35] text-brand-deep">
              خطوات واضحة لبدء تسجيل الطفل
            </h1>
            <p className="mt-4 text-lg leading-9 text-brand-calm">
              يمكن لولي الأمر إرسال بيانات أولية عبر واتساب، ثم تستكمل الإدارة
              إجراءات التأكيد والمستندات والرسوم. تأكيد التسجيل والمقاعد يتم
              عبر إدارة الروضة.
            </p>
            {/* Visual reinforcement */}
            <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-[1.75rem] border border-brand-line/30 shadow-[0_12px_36px_rgba(23,72,58,0.08)]">
              <Image
                src="/images/school-gallery/events/national-day-celebration-01.jpeg"
                alt="أطفال في فعالية بمدرسة قناديل العلم (مرحلة الروضة)"
                fill
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent" />
              <p className="absolute bottom-3 right-4 text-xs font-extrabold text-white drop-shadow-sm">
                من أجواء الروضة
              </p>
            </div>
          </div>
          <LeadForm
            title="بدء طلب التسجيل"
            description="أدخل بيانات ولي الأمر والطفل، وسيفتح واتساب برسالة منظمة للإدارة."
            defaultRequestType="تسجيل"
          />
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="آلية التسجيل"
            title="خطوات التسجيل"
            description="هذه الخطوات تساعد ولي الأمر على تجهيز الطلب قبل مراجعته رسميًا من الإدارة."
          />
          <div className="relative grid gap-4 before:absolute before:bottom-6 before:right-6 before:top-6 before:w-px before:bg-brand-line md:grid-cols-2 md:before:hidden lg:grid-cols-4">
            {schoolInfo.admissionSteps.map((step, index) => (
              <PremiumCard
                key={step}
                className="relative p-5 max-md:me-5"
                variant="feature"
              >
                <span className="absolute -right-[1.45rem] top-8 z-10 size-3 rounded-full bg-brand-warm ring-4 ring-white md:hidden" />
                <IconBadge>
                  {index === schoolInfo.admissionSteps.length - 1 ? (
                    <FileCheck2 className="size-6" aria-hidden="true" />
                  ) : (
                    <ClipboardCheck className="size-6" aria-hidden="true" />
                  )}
                </IconBadge>
                <p className="mt-5 text-sm font-extrabold text-brand-calm">
                  الخطوة {index + 1}
                </p>
                <p className="mt-2 font-extrabold leading-8 text-brand-deep">
                  {step}
                </p>
              </PremiumCard>
            ))}
          </div>
        </div>
      </section>

      <AdmissionDocuments />
    </main>
  );
}
