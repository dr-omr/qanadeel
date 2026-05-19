import { MessageSquareText, Sparkles } from "lucide-react";

export function EmptyTestimonialsState() {
  return (
    <div className="rounded-[2rem] border border-dashed border-brand-calm/45 bg-white/74 p-8 text-center shadow-sm">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-paper text-brand-deep">
        <MessageSquareText className="size-7" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-xl font-extrabold text-brand-deep">
        لم يتم نشر آراء بعد
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-brand-calm">
        كن أول من يشارك تجربته مع قناديل العلم. ستظهر المشاركات بعد مراجعة
        الإدارة حفاظًا على جودة المحتوى وخصوصية المجتمع.
      </p>
      <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-brand-calm shadow-sm">
        <Sparkles className="size-4 text-brand-warm" aria-hidden="true" />
        آراء حقيقية ومنشورة بعد الاعتماد فقط
      </p>
    </div>
  );
}
