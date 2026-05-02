import {
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Heart,
  Users,
  Navigation,
} from "lucide-react";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { SmartActionButton } from "@/components/SmartActionButton";
import { schoolInfo } from "@/data/school-info";
import { buildWhatsappMessage, buildWhatsappUrl } from "@/lib/whatsapp";
import { GalleryPreviewSection } from "@/components/GalleryPreviewSection";
import { LiveReviewsSection } from "@/components/LiveReviewsSection";
import { FaqSection } from "@/components/FaqSection";
import { StorySection } from "@/components/StorySection";
import { WhySection } from "@/components/WhySection";
import { ClassesSection } from "@/components/ClassesSection";
import { InfoSection } from "@/components/InfoSection";
import { ParallaxDivider } from "@/components/ParallaxDivider";

export default function Home() {
  const whatsappUrl = buildWhatsappUrl(
    schoolInfo.whatsappInternational,
    buildWhatsappMessage({
      schoolName: schoolInfo.shortName,
      requestType: "استفسار",
      message: "أرغب بالتواصل مع إدارة الروضة.",
    }),
  );

  return (
    <main className="flex-1">
      {/* ① Hero ─── أول ما يرى الزائر */}
      <Hero />

      {/* ② الصفوف والتسجيل ─── معلومات القرار فوراً */}
      <ClassesSection />

      {/* ③ Why ─── بناء الثقة */}
      <WhySection />

      {/* ④ Story ─── انغماس في تجربة الطفل */}
      <StorySection />

      {/* ⑤ Gallery preview ─── صور حقيقية من الروضة */}
      <Reveal>
        <GalleryPreviewSection />
      </Reveal>

      {/* ⑥ Parallax divider ─── فاصل سينمائي */}
      <ParallaxDivider
        src="/images/school-gallery/events/national-day-celebration-01.jpeg"
        alt="احتفالات الروضة"
        quote="كل طفل فنان.. المشكلة أن يظل فناناً حين يكبر"
        author="بابلو بيكاسو"
      />

      {/* ⑦ الرسوم والموقع والدوام */}
      <InfoSection />

      {/* ⑧ Live Reviews ─── آراء حقيقية */}
      <LiveReviewsSection />

      {/* ⑨ FAQ ─── إجابة الأسئلة الشائعة */}
      <Reveal>
        <FaqSection />
      </Reveal>

      {/* ⑩ CTA واحد فقط ─── دعوة للتواصل */}
      <section className="relative overflow-hidden bg-brand-deep px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {/* Background glows */}
        <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-brand-warm/8 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 size-72 rounded-full bg-emerald-400/6 blur-[80px]" />

        <div className="relative mx-auto max-w-4xl text-center text-white">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-warm/25 bg-brand-warm/10 px-4 py-1.5 text-xs font-extrabold text-brand-warm">
            <Sparkles className="size-3.5" aria-hidden="true" />
            ابدأ الآن
          </div>

          <h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-extrabold leading-[1.3]">
            تعال وشوف بيئة طفلك بعينك
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/60">
            نرحب بزيارتك في أي يوم خلال الدوام — لا تحتاج حجزاً مسبقاً.
            تواصل معنا أو تعال مباشرة إلى {schoolInfo.address}.
          </p>

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <SmartActionButton href={whatsappUrl} external icon={MessageCircle} variant="gold">
              تواصل واتساب
            </SmartActionButton>
            <SmartActionButton href={`tel:${schoolInfo.phone}`} icon={Phone} variant="glass">
              اتصل الآن
            </SmartActionButton>
            <SmartActionButton href={schoolInfo.mapUrl} external icon={Navigation} variant="glass">
              افتح الخريطة
            </SmartActionButton>
          </div>

          {/* Trust strip */}
          <div className="mx-auto mt-10 flex max-w-sm items-center justify-center gap-6 border-t border-white/10 pt-6">
            <div className="flex flex-col items-center gap-1">
              <Heart className="size-5 text-rose-400/80" aria-hidden="true" />
              <span className="text-[0.65rem] font-extrabold text-white/40">بيئة دافئة</span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex flex-col items-center gap-1">
              <Users className="size-5 text-sky-400/80" aria-hidden="true" />
              <span className="text-[0.65rem] font-extrabold text-white/40">فريق مختص</span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="size-5 text-emerald-400/80" aria-hidden="true" />
              <span className="text-[0.65rem] font-extrabold text-white/40">مرخصة رسمياً</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
