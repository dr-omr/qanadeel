import { FileCheck2 } from "lucide-react";
import { schoolInfo } from "@/data/school-info";
import { PremiumCard } from "./PremiumCard";
import { SectionHeader } from "./SectionHeader";

export function AdmissionDocuments() {
  return (
    <section className="bg-brand-paper px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="التسجيل"
          title="المستندات المطلوبة للتسجيل"
          description="يرجى تجهيز المستندات التالية عند التقديم أو عند طلب الإدارة استكمال بيانات الطفل."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {schoolInfo.admissionDocuments.map((document) => (
            <PremiumCard
              key={document}
              className="flex min-h-28 items-center gap-4 p-5"
              variant="compact"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-deep text-white">
                <FileCheck2 className="size-5" aria-hidden="true" />
              </span>
              <p className="font-extrabold leading-8 text-brand-deep">
                {document}
              </p>
            </PremiumCard>
          ))}
        </div>
      </div>
    </section>
  );
}
