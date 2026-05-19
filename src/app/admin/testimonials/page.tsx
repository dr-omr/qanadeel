import type { Metadata } from "next";
import { AdminCommentsPanel } from "@/components/testimonials/admin/AdminCommentsPanel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "إدارة آراء المجتمع | قناديل العلم",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminTestimonialsPage() {
  return (
    <main className="flex-1 bg-[linear-gradient(180deg,#F7F1E6,#fffcf5)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-extrabold text-brand-calm">
            لوحة الإدارة
          </p>
          <h1 className="mt-2 text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-[1.25] text-brand-deep">
            إدارة آراء أولياء الأمور والمعلمين
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-brand-calm sm:text-lg">
            مركز مراجعة آمن للتحكم بما يظهر علنًا في الموقع، مع إبقاء بيانات
            التواصل الخاصة داخل لوحة الإدارة فقط.
          </p>
        </div>
        <AdminCommentsPanel />
      </div>
    </main>
  );
}
