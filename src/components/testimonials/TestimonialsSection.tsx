import Link from "next/link";
import { ArrowLeft, HeartHandshake, MessageCircleHeart, ShieldCheck } from "lucide-react";
import { getApprovedTestimonials } from "@/lib/testimonials";
import { schoolInfo } from "@/data/school-info";
import { buildWhatsappMessage, buildWhatsappUrl } from "@/lib/whatsapp";
import { SmartActionButton } from "@/components/SmartActionButton";
import { EmptyTestimonialsState } from "./EmptyTestimonialsState";
import { TestimonialCard } from "./TestimonialCard";
import { CommentForm } from "./CommentForm";

type TestimonialsSectionProps = {
  limit?: number;
  showForm?: boolean;
  showAllLink?: boolean;
  className?: string;
};

export async function TestimonialsSection({
  limit = 6,
  showForm = true,
  showAllLink = true,
  className = "",
}: TestimonialsSectionProps) {
  const testimonials = await getApprovedTestimonials({ limit });
  const whatsappUrl = buildWhatsappUrl(
    schoolInfo.whatsappInternational,
    buildWhatsappMessage({
      schoolName: schoolInfo.shortName,
      requestType: "استفسار",
      message: "أرغب بمعرفة المزيد عن برامج روضة قناديل العلم.",
    }),
  );

  return (
    <section
      id="testimonials"
      className={`relative overflow-hidden bg-[linear-gradient(180deg,#fffcf5,#F7F1E6)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24 ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-brand-warm/60 to-transparent" />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-extrabold text-brand-calm">
              <HeartHandshake className="size-4" aria-hidden="true" />
              انطباعات مجتمع قناديل العلم
            </p>
            <h2 className="text-[clamp(1.75rem,4vw,2.6rem)] font-extrabold leading-[1.35] text-brand-deep">
              آراء أولياء الأمور والمعلمين
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-brand-calm sm:text-lg">
              نعتز بثقة مجتمع قناديل العلم، ونشارككم بعض الانطباعات التي تعبّر
              عن تجربتهم معنا بعد مراجعتها واعتمادها من الإدارة.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-brand-line bg-white/82 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-extrabold text-brand-calm">
                <ShieldCheck className="size-4" aria-hidden="true" />
                منشورة بعد الاعتماد
              </div>
              <p className="mt-3 text-sm font-bold leading-7 text-brand-calm">
                لا تظهر أي مشاركة للعامة إلا بعد مراجعة الإدارة.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-brand-line bg-white/82 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-extrabold text-brand-calm">
                <MessageCircleHeart className="size-4" aria-hidden="true" />
                خصوصية المجتمع
              </div>
              <p className="mt-3 text-sm font-bold leading-7 text-brand-calm">
                لا ننشر بيانات التواصل أو أي معلومات خاصة.
              </p>
            </div>
          </div>
        </div>

        <div
          className={`mt-9 grid gap-6 ${
            showForm ? "lg:grid-cols-[1.12fr_0.88fr] lg:items-start" : ""
          }`}
        >
          <div>
            {testimonials.length ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {testimonials.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial}
                  />
                ))}
              </div>
            ) : (
              <EmptyTestimonialsState />
            )}

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {showAllLink ? (
                <Link
                  href="/testimonials"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-brand-line bg-white/88 px-6 text-sm font-extrabold text-brand-deep shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-paper"
                >
                  عرض كل الآراء
                  <ArrowLeft className="size-4" aria-hidden="true" />
                </Link>
              ) : null}
              <SmartActionButton href={whatsappUrl} external icon={MessageCircleHeart}>
                هل ترغب بمعرفة المزيد؟ تواصل معنا الآن
              </SmartActionButton>
            </div>
          </div>

          {showForm ? <CommentForm /> : null}
        </div>
      </div>
    </section>
  );
}
