import {
  BookOpen,
  CalendarDays,
  Camera,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Receipt,
  School,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { AppCard } from "@/components/AppCard";
import { GalleryPreviewSection } from "@/components/GalleryPreviewSection";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { SmartActionButton } from "@/components/SmartActionButton";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import { schoolInfo } from "@/data/school-info";
import { buildWhatsappMessage, buildWhatsappUrl } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default function Home() {
  const whatsappMessage = buildWhatsappMessage({
    schoolName: schoolInfo.shortName,
    requestType: "استفسار",
    message: "أرغب بالتواصل مع إدارة الروضة.",
  });
  const whatsappUrl = buildWhatsappUrl(
    schoolInfo.whatsappInternational,
    whatsappMessage,
  );

  return (
    <main className="flex-1">
      <Hero />

      <section className="bg-brand-ivory px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24 lg:pt-14">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-2 shadow-[0_28px_90px_rgba(23,72,58,0.14)]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.6rem]">
              <Image
                src={schoolInfo.heroImagePath}
                alt="واجهة روضة قناديل العلم الخاصة للتعليم المبكر في صحار"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center"
              />
            </div>
          </div>
          <AppCard
            variant="feature"
            icon={Camera}
            iconTone="gold"
            metadata="صورة من مقر الروضة"
            title="مقر واضح وبيئة هادئة في صحار / الجفرة"
            description={schoolInfo.schoolExteriorCaption}
            action={
              <SmartActionButton
                href={schoolInfo.mapUrl}
                external
                icon={Navigation}
                variant="secondary"
              >
                فتح موقع الروضة
              </SmartActionButton>
            }
          />
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-ivory px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-brand-warm/60 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow="عن الروضة"
              title="تعليم مبكر رسمي في بيئة هادئة"
              description="روضة قناديل العلم الخاصة للتعليم المبكر تقدم معلومات واضحة لأولياء الأمور حول الصفوف، الرسوم، التسجيل، والسياسات في سلطنة عمان."
            />
            <SmartActionButton href="/about" icon={BookOpen}>
              عن الروضة
            </SmartActionButton>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <AppCard
              variant="feature"
              icon={ShieldCheck}
              title="بيئة آمنة ومنظمة"
              description="رعاية مناسبة لمرحلة التعليم المبكر وتواصل واضح مع ولي الأمر."
            />
            <AppCard
              variant="feature"
              icon={School}
              iconTone="gold"
              title="بيانات رسمية"
              description="الصفوف والرسوم والسياسات منشورة بوضوح ويمكن الرجوع لتفاصيلها في الصفحات الداخلية."
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="الصفوف والتسجيل"
            title="المراحل المتاحة باختصار"
            description="تعرض الصفحة الرئيسية أهم المعلومات فقط، ويمكن الانتقال لصفحة التسجيل للتفاصيل والمستندات."
            align="center"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {schoolInfo.classes.map((item) => (
              <AppCard
                key={item.stage}
                variant="elevated"
                icon={GraduationCap}
                metadata={`${item.count} صف`}
                title={item.stage}
                description={item.notes}
              />
            ))}
            <AppCard
              variant="feature"
              icon={ClipboardCheck}
              iconTone="gold"
              title="بدء طلب التسجيل"
              description="أرسل بيانات ولي الأمر والطفل عبر واتساب، ثم يتم التأكيد من إدارة الروضة."
              action={
                <SmartActionButton href="/admission" icon={ClipboardCheck}>
                  عرض تفاصيل الصفوف والتسجيل
                </SmartActionButton>
              }
            />
          </div>
        </div>
      </section>

      <GalleryPreviewSection />

      <section className="bg-[linear-gradient(180deg,#F7F1E6,#fffcf5)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <AppCard
            variant="fee"
            icon={Receipt}
            metadata="الرسوم"
            title="٤٠ ريال عماني"
            description="رسوم دراسية معلنة، ويتم تأكيد الرسوم والتسجيل والمقاعد عبر إدارة الروضة."
            action={
              <SmartActionButton href="/fees" icon={Receipt} variant="gold">
                تفاصيل الرسوم
              </SmartActionButton>
            }
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <AppCard
              variant="contact"
              icon={MapPin}
              iconTone="gold"
              title={schoolInfo.address}
              description="موقع الروضة في صحار / الجفرة."
              action={
                <SmartActionButton
                  href={schoolInfo.mapUrl}
                  external
                  icon={Navigation}
                  variant="primary"
                >
                  فتح الخريطة
                </SmartActionButton>
              }
            />
            <AppCard
              variant="contact"
              icon={CalendarDays}
              title="٦:٣٠ إلى ١٢:٣٠"
              description={schoolInfo.workingHours}
              action={
                <SmartActionButton href="/contact" icon={Phone} variant="secondary">
                  بيانات التواصل
                </SmartActionButton>
              }
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="السياسات"
            title="لمحة من السياسات الرسمية"
            description="نعرض هنا أهم السياسات بشكل مختصر، والتفاصيل الكاملة في صفحة السياسات."
            align="center"
          />
          <div className="grid gap-4 md:grid-cols-3">
            {schoolInfo.policies.slice(0, 3).map((policy) => (
              <AppCard
                key={policy.id}
                variant="policy"
                icon={FileText}
                title={policy.title}
                description={policy.summary}
              />
            ))}
          </div>
          <div className="mt-7 flex justify-center">
            <SmartActionButton href="/policies" icon={FileText}>
              عرض كل السياسات
            </SmartActionButton>
          </div>
        </div>
      </section>

      <section className="bg-brand-ivory px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeader
              eyebrow="التسجيل"
              title="خطوات مختصرة قبل إرسال الطلب"
              description="لا يتم تأكيد قبول أو مقعد من الموقع؛ تأكيد التسجيل والمقاعد يتم عبر إدارة الروضة."
            />
            <SmartActionButton href="/admission" icon={ClipboardCheck}>
              بدء التسجيل
            </SmartActionButton>
          </div>
          <div className="grid gap-4">
            {schoolInfo.admissionSteps.slice(0, 3).map((step, index) => (
              <AppCard
                key={step}
                variant="mini"
                icon={ClipboardCheck}
                metadata={`خطوة ${index + 1}`}
                title={step}
              />
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection limit={3} />

      <section className="bg-brand-deep px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-extrabold text-brand-warm">تواصل سريع</p>
            <h2 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-extrabold leading-[1.35]">
              كل طرق التواصل في مكان واحد
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-[#f8f0df]">
              اتصل أو أرسل واتساب أو بريدًا، ويمكنك فتح الخريطة مباشرة للوصول
              إلى موقع الروضة في {schoolInfo.address}.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <SmartActionButton
              href={`tel:${schoolInfo.phone}`}
              icon={Phone}
              variant="glass"
            >
              اتصال {schoolInfo.phone}
            </SmartActionButton>
            <SmartActionButton
              href={whatsappUrl}
              external
              icon={MessageCircle}
              variant="gold"
            >
              واتساب
            </SmartActionButton>
            <SmartActionButton
              href={`mailto:${schoolInfo.email}`}
              icon={Mail}
              variant="glass"
            >
              بريد
            </SmartActionButton>
            <SmartActionButton
              href={schoolInfo.mapUrl}
              external
              icon={Navigation}
              variant="glass"
            >
              خريطة
            </SmartActionButton>
          </div>
        </div>
      </section>
    </main>
  );
}
