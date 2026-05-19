import { CheckCircle2, ShieldCheck } from "lucide-react";

export function SubmitSuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-[2rem] border border-brand-light/60 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(167,191,168,0.18))] p-6 text-brand-deep shadow-[0_24px_72px_rgba(23,72,58,0.12)]">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-deep text-white shadow-inner">
        <CheckCircle2 className="size-7" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-2xl font-extrabold">
        تم استلام مشاركتك بنجاح
      </h3>
      <p className="mt-3 leading-8 text-brand-calm">
        ستظهر المشاركة في الموقع بعد مراجعتها من الإدارة. شكرًا لثقتك بقناديل
        العلم.
      </p>
      <div className="mt-5 flex items-start gap-2 rounded-2xl bg-brand-paper px-4 py-3 text-sm font-bold leading-7 text-brand-calm">
        <ShieldCheck className="mt-1 size-4 shrink-0 text-brand-deep" />
        يتم نشر الآراء المعتمدة فقط، ولا يتم عرض بيانات التواصل للعامة.
      </div>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-brand-line bg-white px-5 text-sm font-extrabold text-brand-deep transition hover:-translate-y-0.5 hover:bg-brand-paper"
      >
        إرسال مشاركة أخرى
      </button>
    </div>
  );
}
