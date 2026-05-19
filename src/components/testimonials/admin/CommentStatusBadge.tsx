import type { TestimonialStatus } from "@/lib/testimonials";
import { testimonialStatusLabels } from "@/lib/testimonial-labels";

const statusClasses: Record<TestimonialStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  rejected: "border-red-200 bg-red-50 text-red-800",
  hidden: "border-slate-200 bg-slate-50 text-slate-700",
};

export function CommentStatusBadge({
  status,
}: {
  status: TestimonialStatus;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-extrabold ${statusClasses[status]}`}
    >
      {testimonialStatusLabels[status]}
    </span>
  );
}
