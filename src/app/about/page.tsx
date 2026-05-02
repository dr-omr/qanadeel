import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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

      {/* ─── Gallery showcase section ─── */}
      <section className="bg-brand-ivory px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="من داخل الروضة"
              title="لحظات حقيقية من بيئتنا"
              description="فعاليات، أول يوم دراسي، وحفلات تخرج — لمحة من يومياتنا."
              className="mb-0"
            />
            <Link
              href="/gallery"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-brand-line bg-white px-5 py-2.5 text-sm font-extrabold text-brand-deep shadow-sm transition hover:bg-brand-ivory hover:shadow-md"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              عرض كل الصور
            </Link>
          </div>

          {/* 3-column image grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                src: "/images/school-gallery/events/national-day-performance-01.jpeg",
                alt: "عرض أطفال في احتفال العيد الوطني بروضة قناديل العلم",
                label: "فعاليات الروضة",
              },
              {
                src: "/images/school-gallery/classrooms/first-day-girls-01.jpeg",
                alt: "أول يوم دراسي لأطفال روضة قناديل العلم",
                label: "أول يوم دراسي",
              },
              {
                src: "/images/school-gallery/events/graduation-ceremony-01.jpeg",
                alt: "حفل تخرج أطفال روضة قناديل العلم",
                label: "حفل التخرج",
              },
            ].map((img) => (
              <Link
                key={img.src}
                href="/gallery"
                className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-brand-line/30 shadow-[0_12px_36px_rgba(23,72,58,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_56px_rgba(23,72,58,0.14)]"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/60 to-transparent" />
                <p className="absolute bottom-3 right-4 text-sm font-extrabold text-white drop-shadow-sm">
                  {img.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
