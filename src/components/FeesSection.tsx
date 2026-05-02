import { BadgeDollarSign, Info, Receipt } from "lucide-react";
import { schoolInfo } from "@/data/school-info";
import { IconBadge, PremiumCard } from "./PremiumCard";
import { SectionHeader } from "./SectionHeader";

export function FeesSection() {
  const { tuitionFees } = schoolInfo;

  return (
    <section id="fees" className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="الإفصاح المالي"
          title="الرسوم الدراسية"
          description="يتم عرض الرسوم الدراسية الأساسية بصورة واضحة لولي الأمر قبل التسجيل، مع تأكيدها رسميًا من الإدارة."
        />

        <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
          <PremiumCard className="p-7" variant="strong">
            <span className="absolute -left-12 -top-12 size-40 rounded-full bg-brand-warm/20" />
            <div className="relative">
              <IconBadge className="bg-white/14 text-brand-warm">
                <BadgeDollarSign className="size-6" aria-hidden="true" />
              </IconBadge>
              <p className="mt-6 text-sm font-extrabold text-[#f5e8cf]">
                {tuitionFees.label}
              </p>
              <p className="mt-4 text-[clamp(2.4rem,12vw,4.5rem)] font-extrabold leading-none">
                {tuitionFees.value}
                <span className="me-3 text-xl text-[#f5e8cf] sm:text-2xl">
                  {schoolInfo.currency}
                </span>
              </p>
              <p className="mt-6 text-sm leading-7 text-[#f8f0df]">
                رسوم معلنة ضمن بيانات الإفصاح ويتم تأكيدها عند التسجيل.
              </p>
            </div>
          </PremiumCard>

          <PremiumCard className="p-7" variant="soft">
            <IconBadge>
              <Info className="size-6" aria-hidden="true" />
            </IconBadge>
            <h3 className="mt-5 text-xl font-extrabold text-brand-deep">
              ملاحظة مهمة
            </h3>
            <p className="mt-4 leading-8 text-brand-calm">{tuitionFees.note}</p>
            <div className="mt-6 rounded-3xl border border-brand-line bg-white/80 p-5">
              <div className="flex items-center gap-3 text-brand-deep">
                <Receipt className="size-5" aria-hidden="true" />
                <p className="font-extrabold">العملة المعتمدة</p>
              </div>
              <p className="mt-2 text-sm font-bold text-brand-calm">
                {schoolInfo.currency} ({schoolInfo.currencyShort})
              </p>
            </div>
          </PremiumCard>
        </div>
      </div>
    </section>
  );
}
