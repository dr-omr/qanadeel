import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { IconBadge, PremiumCard } from "@/components/PremiumCard";
import { PoliciesSection } from "@/components/PoliciesSection";
import { schoolInfo } from "@/data/school-info";

export const metadata: Metadata = {
  title: `السياسات | ${schoolInfo.shortName}`,
  description:
    "سياسات القبول والحضور والسلامة والتواصل والرسوم في مدرسة قناديل العلم الخاصة للتعليم المبكر (مرحلة الروضة) في سلطنة عمان.",
};

export default function PoliciesPage() {
  return (
    <main className="flex-1">
      <section className="bg-brand-ivory px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <PremiumCard className="p-6 sm:p-8" variant="highlighted">
            <IconBadge size="lg">
              <ShieldCheck className="size-7" aria-hidden="true" />
            </IconBadge>
            <p className="mt-6 text-sm font-extrabold text-brand-calm">
              صفحة السياسات
            </p>
            <h1 className="mt-3 max-w-4xl text-[clamp(2rem,5vw,3.35rem)] font-extrabold leading-[1.35] text-brand-deep">
              سياسات رسمية سهلة القراءة لأولياء الأمور
            </h1>
            <p className="mt-4 max-w-4xl text-lg leading-9 text-brand-calm">
              تجمع هذه الصفحة السياسات الأساسية ذات الصلة بالقبول والحضور
              والسلامة والتواصل والرسوم، بما يدعم وضوح العلاقة بين الروضة وولي
              الأمر في سلطنة عمان.
            </p>
          </PremiumCard>
        </div>
      </section>
      <PoliciesSection />
    </main>
  );
}
