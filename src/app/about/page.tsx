import type { Metadata } from "next";
import Image from "next/image";
import { BookOpen, Camera, Landmark, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { IconBadge, PremiumCard } from "@/components/PremiumCard";
import { SectionHeader } from "@/components/SectionHeader";
import { schoolInfo } from "@/data/school-info";

export const metadata: Metadata = {
  title: `عن الروضة | ${schoolInfo.shortName}`,
  description:
    "نبذة عن روضة قناديل العلم الخاصة للتعليم المبكر ورؤيتها ورسالتها وبيئتها التعليمية في سلطنة عمان.",
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      <section className="bg-brand-ivory px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <PremiumCard className="p-2" hover={false}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.65rem]">
              <Image
                src={schoolInfo.heroImagePath}
                alt="واجهة روضة قناديل العلم الخاصة للتعليم المبكر في صحار"
                fill
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-[1.25rem] border border-white/60 bg-white/88 p-4 shadow-[0_16px_38px_rgba(23,72,58,0.16)] backdrop-blur">
                <div className="flex items-start gap-3">
                  <IconBadge size="sm">
                    <Camera className="size-5" aria-hidden="true" />
                  </IconBadge>
                  <div>
                    <p className="text-sm font-extrabold text-brand-deep">
                      صورة من مقر الروضة
                    </p>
                    <p className="mt-1 text-xs font-bold leading-6 text-brand-calm">
                      {schoolInfo.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </PremiumCard>
          <div>
            <p className="text-sm font-extrabold text-brand-calm">
              عن الروضة
            </p>
            <h1 className="mt-3 text-[clamp(2rem,5vw,3.35rem)] font-extrabold leading-[1.35] text-brand-deep">
              {schoolInfo.officialName}
            </h1>
            <p className="mt-4 text-lg leading-9 text-brand-calm">
              {schoolInfo.about.description}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="هويتنا التعليمية"
            title="رؤية ورسالة وبيئة تعلم واضحة"
            description="تعكس بيانات هذه الصفحة هوية الروضة وسياقها التعليمي في سلطنة عمان."
          />
          <div className="grid gap-5 md:grid-cols-3">
            <PremiumCard className="p-6" variant="feature">
              <IconBadge>
                <Sparkles className="size-6" aria-hidden="true" />
              </IconBadge>
              <h2 className="mt-5 text-xl font-extrabold text-brand-deep">
                الرؤية
              </h2>
              <p className="mt-3 leading-8 text-brand-calm">
                {schoolInfo.about.vision}
              </p>
            </PremiumCard>
            <PremiumCard className="p-6" variant="soft">
              <IconBadge>
                <BookOpen className="size-6" aria-hidden="true" />
              </IconBadge>
              <h2 className="mt-5 text-xl font-extrabold text-brand-deep">
                الرسالة
              </h2>
              <p className="mt-3 leading-8 text-brand-calm">
                {schoolInfo.about.mission}
              </p>
            </PremiumCard>
            <PremiumCard className="p-6">
              <IconBadge>
                <ShieldCheck className="size-6" aria-hidden="true" />
              </IconBadge>
              <h2 className="mt-5 text-xl font-extrabold text-brand-deep">
                البيئة التعليمية
              </h2>
              <p className="mt-3 leading-8 text-brand-calm">
                بيئة تعليم مبكر آمنة ومنظمة، تراعي احتياجات الطفل وتدعم تواصلًا
                واضحًا مع ولي الأمر وفق الأنظمة والتعليمات التعليمية المعتمدة في
                سلطنة عمان.
              </p>
            </PremiumCard>
          </div>

          <PremiumCard className="mt-6 p-6" variant="highlighted">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <IconBadge>
                <Landmark className="size-6" aria-hidden="true" />
              </IconBadge>
              <div>
                <h2 className="text-xl font-extrabold text-brand-deep">
                  سياق سلطنة عمان
                </h2>
                <p className="mt-3 leading-8 text-brand-calm">
                  {schoolInfo.about.statement}
                </p>
              </div>
            </div>
          </PremiumCard>

          <PremiumCard className="mt-6 p-6" variant="contact">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <IconBadge tone="gold">
                <MapPin className="size-6" aria-hidden="true" />
              </IconBadge>
              <div>
                <h2 className="text-xl font-extrabold text-brand-deep">
                  موقع المقر
                </h2>
                <p className="mt-3 leading-8 text-brand-calm">
                  {schoolInfo.schoolExteriorCaption}
                </p>
              </div>
            </div>
          </PremiumCard>
        </div>
      </section>
    </main>
  );
}
