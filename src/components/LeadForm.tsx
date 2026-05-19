"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import {
  Baby,
  ClipboardCheck,
  GraduationCap,
  MessageCircle,
  Phone,
  Send,
  UserRound,
} from "lucide-react";
import { schoolInfo } from "@/data/school-info";
import { buildWhatsappMessage, buildWhatsappUrl } from "@/lib/whatsapp";
import { IconBadge } from "./IconBadge";

type LeadFormProps = {
  title?: string;
  description?: string;
  defaultRequestType?: string;
  compact?: boolean;
};

const inputClass =
  "min-h-12 rounded-2xl border border-brand-line bg-brand-ivory px-4 text-base font-bold text-brand-deep outline-none transition focus:border-brand-deep focus:ring-4 focus:ring-brand-deep/10";

const textareaClass =
  "resize-none rounded-2xl border border-brand-line bg-brand-ivory px-4 py-3 text-base font-bold leading-8 text-brand-deep outline-none transition focus:border-brand-deep focus:ring-4 focus:ring-brand-deep/10";

export function LeadForm({
  title = "نموذج التواصل عبر واتساب",
  description = "يفتح النموذج محادثة واتساب برسالة جاهزة يمكن تعديلها قبل الإرسال.",
  defaultRequestType = schoolInfo.requestTypes[0],
  compact = false,
}: LeadFormProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultMessage = useMemo(
    () =>
      defaultRequestType === "تسجيل"
        ? "أرغب ببدء تسجيل طفلي، وأعلم أن تأكيد التسجيل والمقاعد يتم عبر إدارة الروضة."
        : "أرغب بالاستفسار عن خدمات الروضة.",
    [defaultRequestType],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const mobile = String(formData.get("mobile") ?? "").trim();
    const childAge = String(formData.get("childAge") ?? "").trim();
    const requestedStage = String(formData.get("requestedStage") ?? "").trim();
    const requestType = String(formData.get("requestType") ?? "").trim();
    const message =
      String(formData.get("message") ?? "").trim() || defaultMessage;

    const nextErrors = [];
    if (!name) nextErrors.push("يرجى كتابة اسم ولي الأمر.");
    if (!mobile) nextErrors.push("يرجى كتابة رقم الجوال.");
    if (!requestType) nextErrors.push("يرجى اختيار نوع الطلب.");

    if (nextErrors.length) {
      setErrors(nextErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors([]);
    const whatsappMessage = buildWhatsappMessage({
      schoolName: schoolInfo.shortName,
      name,
      mobile,
      childAge,
      requestedStage,
      requestType,
      message,
    });

    window.open(
      buildWhatsappUrl(schoolInfo.whatsappInternational, whatsappMessage),
      "_blank",
      "noopener,noreferrer",
    );
    setIsSubmitting(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-[2rem] border border-brand-line bg-white/90 p-6 shadow-[0_24px_72px_rgba(16,64,45,0.10)] backdrop-blur-sm ${
        compact ? "" : "lg:p-7"
      }`}
    >
      <IconBadge>
        <Send className="size-6" aria-hidden="true" />
      </IconBadge>
      <h3 className="mt-5 text-xl font-extrabold text-brand-deep">{title}</h3>
      <p className="mt-2 leading-8 text-brand-calm">{description}</p>

      {errors.length ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-7 text-red-700">
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      ) : null}

      <div className="mt-6 grid gap-5">
        <label className="grid gap-2 text-sm font-extrabold text-brand-deep">
          <span className="inline-flex items-center gap-2">
            <UserRound className="size-4" aria-hidden="true" />
            اسم ولي الأمر
          </span>
          <input
            name="name"
            type="text"
            className={inputClass}
          />
        </label>

        <label className="grid gap-2 text-sm font-extrabold text-brand-deep">
          <span className="inline-flex items-center gap-2">
            <Phone className="size-4" aria-hidden="true" />
            رقم الجوال
          </span>
          <input
            name="mobile"
            type="tel"
            className={inputClass}
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-extrabold text-brand-deep">
            <span className="inline-flex items-center gap-2">
              <Baby className="size-4" aria-hidden="true" />
              عمر الطفل
            </span>
            <input
              name="childAge"
              type="text"
              className={inputClass}
            />
          </label>

          <label className="grid gap-2 text-sm font-extrabold text-brand-deep">
            <span className="inline-flex items-center gap-2">
              <GraduationCap className="size-4" aria-hidden="true" />
              المرحلة المطلوبة
            </span>
            <select
              name="requestedStage"
              className={`${inputClass} appearance-none`}
              defaultValue={schoolInfo.contactFormStages[0]}
            >
              {schoolInfo.contactFormStages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="grid gap-2 text-sm font-extrabold text-brand-deep">
          <span className="inline-flex items-center gap-2">
            <ClipboardCheck className="size-4" aria-hidden="true" />
            نوع الطلب
          </span>
          <select
            name="requestType"
            className={`${inputClass} appearance-none`}
            defaultValue={defaultRequestType}
          >
            {schoolInfo.requestTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-extrabold text-brand-deep">
          الرسالة
          <textarea
            name="message"
            rows={5}
            className={textareaClass}
            defaultValue={defaultMessage}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-deep px-6 text-base font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#11382d] disabled:cursor-not-allowed disabled:bg-brand-calm"
      >
        <MessageCircle className="size-5" aria-hidden="true" />
        {isSubmitting ? "جارٍ تجهيز الرسالة..." : "إرسال عبر واتساب"}
      </button>
    </form>
  );
}
