import { Bus, CircleSlash } from "lucide-react";
import { schoolInfo } from "@/data/school-info";
import { IconBadge, PremiumCard } from "./PremiumCard";
import { SectionHeader } from "./SectionHeader";

export function TransportSection() {
  return (
    <section className="bg-brand-ivory px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="خدمات النقل"
          title="رسوم نقل الطلبة"
          description="توضح الروضة حالة خدمة النقل والرسوم المتعلقة بها في الوقت الحالي."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <PremiumCard className="p-6 md:col-span-2">
            <IconBadge>
              <CircleSlash className="size-6" aria-hidden="true" />
            </IconBadge>
            <p className="mt-5 text-2xl font-extrabold text-brand-deep">
              {schoolInfo.transportFees.status}
            </p>
            <p className="mt-4 leading-8 text-brand-calm">
              {schoolInfo.transportFees.note}
            </p>
          </PremiumCard>
          <PremiumCard className="p-6" variant="soft">
            <IconBadge>
              <Bus className="size-6" aria-hidden="true" />
            </IconBadge>
            <p className="mt-5 text-sm font-extrabold text-brand-calm">
              رسوم النقل
            </p>
            <p className="mt-3 text-2xl font-extrabold text-brand-deep">
              {schoolInfo.transportFees.fee}
            </p>
          </PremiumCard>
        </div>
      </div>
    </section>
  );
}
