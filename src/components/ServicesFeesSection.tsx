import { Info } from "lucide-react";
import { schoolInfo, type ServiceFee } from "@/data/school-info";
import { PremiumCard } from "./PremiumCard";
import { ResponsiveInfoTable } from "./ResponsiveInfoTable";
import { SectionHeader } from "./SectionHeader";

const columns = [
  {
    key: "service",
    header: "الخدمة",
    render: (row: ServiceFee) => row.service,
  },
  {
    key: "fee",
    header: "الرسوم",
    render: (row: ServiceFee) => row.fee,
  },
  {
    key: "notes",
    header: "ملاحظات",
    render: (row: ServiceFee) => row.notes,
  },
];

export function ServicesFeesSection() {
  return (
    <section id="services" className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="الخدمات"
          title="رسوم الخدمات"
          description="توضح القائمة التالية الخدمات المتاحة وما يقابلها من رسوم أو آلية تحديدها عند الحاجة."
        />

        <ResponsiveInfoTable
          rows={schoolInfo.serviceFees}
          columns={columns}
          getRowKey={(row) => row.service}
          accent="deep"
        />

        <PremiumCard className="mt-5 flex gap-4 p-5" variant="soft" hover={false}>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-brand-warm/24 text-brand-deep">
            <Info className="size-5" aria-hidden="true" />
          </span>
          <p className="leading-8 text-brand-calm">
            أي رسوم إضافية يتم توضيحها لولي الأمر قبل التسجيل أو عند طلب
            الخدمة.
          </p>
        </PremiumCard>
      </div>
    </section>
  );
}
