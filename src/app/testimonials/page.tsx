import type { Metadata } from "next";
import Link from "next/link";
import { HeartHandshake, MessageSquarePlus, ShieldCheck } from "lucide-react";
import { CommentForm } from "@/components/testimonials/CommentForm";
import { EmptyTestimonialsState } from "@/components/testimonials/EmptyTestimonialsState";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import {
  getApprovedTestimonials,
  testimonialRoles,
  type TestimonialRole,
} from "@/lib/testimonials";
import { testimonialRoleLabels } from "@/lib/testimonial-labels";
import { schoolInfo } from "@/data/school-info";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `آراء أولياء الأمور والمعلمين | ${schoolInfo.shortName}`,
  description:
    "آراء وانطباعات منشورة بعد مراجعة الإدارة من مجتمع روضة قناديل العلم الخاصة للتعليم المبكر.",
};

type TestimonialsPageProps = {
  searchParams: Promise<{ role?: string }>;
};

function getRoleFilter(value?: string): TestimonialRole | "all" {
  if (!value || value === "all") return "all";
  return testimonialRoles.includes(value as TestimonialRole)
    ? (value as TestimonialRole)
    : "all";
}

export default async function TestimonialsPage({
  searchParams,
}: TestimonialsPageProps) {
  const { role } = await searchParams;
  const selectedRole = getRoleFilter(role);
  const testimonials = await getApprovedTestimonials({
    limit: 80,
    role: selectedRole,
  });
  const filters: Array<{ label: string; href: string; active: boolean }> = [
    {
      label: "الكل",
      href: "/testimonials",
      active: selectedRole === "all",
    },
    ...testimonialRoles.map((item) => ({
      label: testimonialRoleLabels[item],
      href: `/testimonials?role=${item}`,
      active: selectedRole === item,
    })),
  ];

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#F7F1E6,#fffcf5)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-brand-warm/60 to-transparent" />
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 text-sm font-extrabold text-brand-calm">
                <HeartHandshake className="size-4" aria-hidden="true" />
                تجارب أولياء الأمور والمعلمين
              </p>
              <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.25] text-brand-deep">
                ماذا يقول مجتمع قناديل العلم؟
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-brand-calm sm:text-lg">
                نشارك هنا الآراء المعتمدة فقط، بما يحافظ على خصوصية المجتمع
                ويعكس تجربة حقيقية وهادئة لأولياء الأمور والمعلمين والزوار.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-brand-line bg-white/82 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-extrabold text-brand-calm">
                  <ShieldCheck className="size-4" aria-hidden="true" />
                  مراجعة إدارية
                </div>
                <p className="mt-3 text-sm font-bold leading-7 text-brand-calm">
                  لا تظهر المشاركات الجديدة إلا بعد الاعتماد.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-brand-line bg-white/82 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-extrabold text-brand-calm">
                  <MessageSquarePlus className="size-4" aria-hidden="true" />
                  مشاركة مفتوحة
                </div>
                <p className="mt-3 text-sm font-bold leading-7 text-brand-calm">
                  يمكن لأولياء الأمور والمعلمين والزوار إرسال رأيهم للمراجعة.
                </p>
              </div>
            </div>
          </div>

          <nav
            aria-label="تصفية الآراء حسب الصفة"
            className="mt-8 flex flex-wrap gap-2"
          >
            {filters.map((filter) => (
              <Link
                key={filter.href}
                href={filter.href}
                className={`inline-flex min-h-11 items-center justify-center rounded-full border px-5 text-sm font-extrabold transition ${
                  filter.active
                    ? "border-brand-deep bg-brand-deep text-white shadow-[0_14px_34px_rgba(23,72,58,0.2)]"
                    : "border-brand-line bg-white/88 text-brand-calm hover:bg-brand-paper hover:text-brand-deep"
                }`}
              >
                {filter.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.12fr_0.88fr] lg:items-start">
            <div>
              {testimonials.length ? (
                <div className="grid gap-5 md:grid-cols-2">
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
            </div>

            <CommentForm />
          </div>
        </div>
      </section>
    </main>
  );
}
