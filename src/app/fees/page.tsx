import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, ReceiptText } from "lucide-react";
import { FeesSection } from "@/components/FeesSection";
import { IconBadge, PremiumCard } from "@/components/PremiumCard";
import { ServicesFeesSection } from "@/components/ServicesFeesSection";
import { TransportSection } from "@/components/TransportSection";
import { schoolInfo } from "@/data/school-info";
import { buildWhatsappMessage, buildWhatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: `الرسوم | ${schoolInfo.shortName}`,
  description:
    "تفاصيل الرسوم الدراسية ورسوم الخدمات والنقل في روضة قناديل العلم الخاصة للتعليم المبكر في سلطنة عمان.",
};

export default function FeesPage() {
  const message = buildWhatsappMessage({
    schoolName: schoolInfo.shortName,
    requestType: "استفسار",
    message: "أرغب بالاستفسار عن الرسوم الدراسية ورسوم الخدمات.",
  });

  return (
    <main className="flex-1">
      <section className="bg-brand-ivory px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_0.72fr] lg:items-center">
          <div>
            <p className="text-sm font-extrabold text-brand-calm">
              صفحة الرسوم
            </p>
            <h1 className="mt-3 text-[clamp(2rem,5vw,3.4rem)] font-extrabold leading-[1.35] text-brand-deep">
              رسوم واضحة قبل التسجيل
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-9 text-brand-calm">
              تعرض هذه الصفحة الرسوم الدراسية، حالة النقل، ورسوم الخدمات
              المعلنة لولي الأمر، مع تأكيد أن أي تحديث يتم وفق الأنظمة
              والتعليمات التعليمية المعتمدة في سلطنة عمان.
            </p>
          </div>
          <PremiumCard variant="fee" className="p-6">
            <IconBadge tone="glass">
              <ReceiptText className="size-6" aria-hidden="true" />
            </IconBadge>
            <p className="mt-5 text-sm font-extrabold text-[#f5e8cf]">
              الرسوم الدراسية الحالية
            </p>
            <p className="mt-3 text-5xl font-extrabold">
              {schoolInfo.tuitionFees.value}
              <span className="me-2 text-xl">{schoolInfo.currency}</span>
            </p>
            <a
              href={buildWhatsappUrl(schoolInfo.whatsappInternational, message)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-extrabold text-brand-deep"
            >
              <MessageCircle className="size-5" aria-hidden="true" />
              استفسار عبر واتساب
            </a>
          </PremiumCard>
        </div>
      </section>

      <FeesSection />
      <TransportSection />
      <ServicesFeesSection />

      <section className="bg-brand-ivory px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <PremiumCard className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-brand-deep">
                تحتاج تأكيد الرسوم؟
              </h2>
              <p className="mt-2 leading-8 text-brand-calm">
                تأكيد الرسوم والتسجيل والمقاعد يتم عبر إدارة الروضة.
              </p>
            </div>
            <Link
              href="/admission"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-deep px-6 text-sm font-extrabold text-white"
            >
              انتقل للتسجيل
            </Link>
          </PremiumCard>
        </div>
      </section>
    </main>
  );
}
