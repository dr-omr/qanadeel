import type { TestimonialRole, TestimonialStatus } from "@/lib/testimonials";

export const testimonialRoleLabels: Record<TestimonialRole, string> = {
  parent: "ولي أمر",
  teacher: "معلم",
  visitor: "زائر",
};

export const testimonialStatusLabels: Record<TestimonialStatus, string> = {
  pending: "بانتظار المراجعة",
  approved: "منشورة",
  rejected: "مرفوضة",
  hidden: "مخفية",
};

export function formatArabicDate(value: string) {
  return new Intl.DateTimeFormat("ar-OM", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export const arabicNumber = new Intl.NumberFormat("ar-OM");

export const arabicDecimalNumber = new Intl.NumberFormat("ar-OM", {
  maximumFractionDigits: 1,
});
