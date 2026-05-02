import Image from "next/image";
import { Landmark, ShieldCheck } from "lucide-react";
import { schoolInfo } from "@/data/school-info";
import { IconBadge, PremiumCard } from "./PremiumCard";
import { SectionHeader } from "./SectionHeader";

export function AboutSection() {
  return (
    <section id="about" className="bg-brand-ivory px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <PremiumCard className="p-5 sm:p-6" hover={false}>
          <Image
            src={schoolInfo.logoPath}
            alt={schoolInfo.officialName}
            width={1200}
            height={461}
            className="w-full object-contain"
          />
        </PremiumCard>

        <div>
          <SectionHeader
            eyebrow={schoolInfo.about.eyebrow}
            title={schoolInfo.about.title}
            description={schoolInfo.about.description}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <PremiumCard className="p-6" variant="soft">
              <IconBadge>
                <Landmark className="size-6" aria-hidden="true" />
              </IconBadge>
              <p className="mt-5 text-lg font-extrabold text-brand-deep">
                {schoolInfo.officialName}
              </p>
              <p className="mt-3 leading-8 text-brand-calm">
                {schoolInfo.about.statement}
              </p>
            </PremiumCard>
            <PremiumCard className="p-6">
              <IconBadge>
                <ShieldCheck className="size-6" aria-hidden="true" />
              </IconBadge>
              <p className="mt-5 text-lg font-extrabold text-brand-deep">
                بيئة منظمة في {schoolInfo.country}
              </p>
              <p className="mt-3 leading-8 text-brand-calm">
                يعتمد المحتوى على الإفصاح الواضح عن الصفوف والرسوم والخدمات
                والسياسات ذات الصلة بولي الأمر والطفل.
              </p>
            </PremiumCard>
          </div>
        </div>
      </div>
    </section>
  );
}
