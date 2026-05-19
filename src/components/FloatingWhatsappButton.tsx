import { MessageCircle } from "lucide-react";
import { schoolInfo } from "@/data/school-info";
import { buildWhatsappMessage, buildWhatsappUrl } from "@/lib/whatsapp";

export function FloatingWhatsappButton() {
  const message = buildWhatsappMessage({
    schoolName: schoolInfo.shortName,
    message: "أرغب بالتواصل مع الإدارة والاستفسار عن التسجيل.",
  });

  return (
    <a
      href={buildWhatsappUrl(schoolInfo.whatsappInternational, message)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[calc(112px+env(safe-area-inset-bottom))] right-4 z-[55] inline-flex min-h-[3.25rem] items-center gap-2 rounded-full bg-brand-deep px-4 text-sm font-extrabold text-white shadow-[0_20px_50px_rgba(16,64,45,0.28)] transition hover:-translate-y-1 hover:bg-[#11382d] max-[380px]:px-3 lg:bottom-6 lg:right-6"
      aria-label="التواصل عبر واتساب"
    >
      <span className="flex size-8 items-center justify-center rounded-full bg-white text-brand-deep">
        <MessageCircle className="size-4" aria-hidden="true" />
      </span>
      واتساب
    </a>
  );
}
