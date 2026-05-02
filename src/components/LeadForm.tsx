"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import {
  Baby,
  CheckCircle,
  ClipboardCheck,
  GraduationCap,
  Mail,
  MessageCircle,
  Phone,
  Send,
  UserRound,
  XCircle,
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

type SubmitStatus = "idle" | "sending" | "success" | "error";

const inputClass =
  "min-h-12 rounded-2xl border border-brand-line bg-brand-ivory px-4 text-base font-bold text-brand-deep outline-none transition focus:border-brand-deep focus:ring-4 focus:ring-brand-deep/10";

const textareaClass =
  "resize-none rounded-2xl border border-brand-line bg-brand-ivory px-4 py-3 text-base font-bold leading-8 text-brand-deep outline-none transition focus:border-brand-deep focus:ring-4 focus:ring-brand-deep/10";

export function LeadForm({
  title = "نموذج التواصل",
  description = "أرسل بياناتك وسنرسلها للإدارة مباشرةً عبر البريد — كما يفتح واتساب برسالة جاهزة.",
  defaultRequestType = schoolInfo.requestTypes[0],
  compact = false,
}: LeadFormProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const defaultMessage = useMemo(
    () =>
      defaultRequestType === "تسجيل"
        ? "أرغب ببدء تسجيل طفلي، وأعلم أن تأكيد التسجيل والمقاعد يتم عبر إدارة الروضة."
        : "أرغب بالاستفسار عن خدمات الروضة.",
    [defaultRequestType],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const mobile = String(formData.get("mobile") ?? "").trim();
    const childAge = String(formData.get("childAge") ?? "").trim();
    const requestedStage = String(formData.get("requestedStage") ?? "").trim();
    const requestType = String(formData.get("requestType") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim() || defaultMessage;

    const nextErrors: string[] = [];
    if (!name) nextErrors.push("يرجى كتابة اسم ولي الأمر.");
    if (!mobile) nextErrors.push("يرجى كتابة رقم الجوال.");
    if (!requestType) nextErrors.push("يرجى اختيار نوع الطلب.");

    if (nextErrors.length) {
      setErrors(nextErrors);
      return;
    }

    setErrors([]);
    setStatus("sending");

    // 1️⃣ Send email via Resend API
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobile, childAge, requestedStage, requestType, message }),
      });
      const json = await res.json();
      if (!json.success) throw new Error("Email failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }

    // 2️⃣ Also open WhatsApp (always — even if email fails)
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
  }

  // ── Success state ──
  if (status === "success") {
    return (
      <div className={`rounded-[2rem] border border-emerald-200 bg-emerald-50 p-8 text-center ${compact ? "" : "lg:p-10"}`}>
        <CheckCircle className="mx-auto size-14 text-emerald-500" />
        <h3 className="mt-4 text-xl font-extrabold text-brand-deep">تم الإرسال بنجاح!</h3>
        <p className="mt-2 leading-8 text-brand-calm">
          تم إرسال بياناتك للإدارة عبر البريد الإلكتروني. كما تم فتح واتساب لإكمال التواصل المباشر.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-deep px-6 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#11382d]"
        >
          إرسال رسالة أخرى
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-[2rem] border border-brand-line bg-white/90 p-6 shadow-[0_24px_72px_rgba(16,64,45,0.10)] backdrop-blur-sm ${compact ? "" : "lg:p-7"}`}
    >
      <IconBadge>
        <Send className="size-6" aria-hidden="true" />
      </IconBadge>
      <h3 className="mt-5 text-xl font-extrabold text-brand-deep">{title}</h3>
      <p className="mt-2 leading-8 text-brand-calm">{description}</p>

      {/* Dual-channel badge */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 ring-1 ring-emerald-200">
          <Mail className="size-3" />
          بريد للإدارة
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-extrabold text-green-700 ring-1 ring-green-200">
          <MessageCircle className="size-3" />
          واتساب مباشر
        </span>
      </div>

      {errors.length > 0 && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <XCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
          <div className="text-sm font-bold leading-7 text-red-700">
            {errors.map((e) => <p key={e}>{e}</p>)}
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3">
          <XCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
          <p className="text-sm font-bold text-orange-700">
            فشل إرسال البريد، لكن تم فتح واتساب. يمكنك التواصل مباشرة.
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-5">
        <label className="grid gap-2 text-sm font-extrabold text-brand-deep">
          <span className="inline-flex items-center gap-2">
            <UserRound className="size-4" aria-hidden="true" />
            اسم ولي الأمر *
          </span>
          <input name="name" type="text" autoComplete="name" className={inputClass} placeholder="مثال: محمد بن سالم" />
        </label>

        <label className="grid gap-2 text-sm font-extrabold text-brand-deep">
          <span className="inline-flex items-center gap-2">
            <Phone className="size-4" aria-hidden="true" />
            رقم الجوال *
          </span>
          <input name="mobile" type="tel" autoComplete="tel" className={inputClass} placeholder="9XXXXXXXX" />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-extrabold text-brand-deep">
            <span className="inline-flex items-center gap-2">
              <Baby className="size-4" aria-hidden="true" />
              عمر الطفل
            </span>
            <input name="childAge" type="text" className={inputClass} placeholder="مثال: 4 سنوات" />
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
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="grid gap-2 text-sm font-extrabold text-brand-deep">
          <span className="inline-flex items-center gap-2">
            <ClipboardCheck className="size-4" aria-hidden="true" />
            نوع الطلب *
          </span>
          <select
            name="requestType"
            className={`${inputClass} appearance-none`}
            defaultValue={defaultRequestType}
          >
            {schoolInfo.requestTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-extrabold text-brand-deep">
          الرسالة
          <textarea
            name="message"
            rows={4}
            className={textareaClass}
            defaultValue={defaultMessage}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-deep px-6 text-base font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#11382d] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? (
          <>
            <span className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            جارٍ الإرسال...
          </>
        ) : (
          <>
            <Send className="size-5" />
            إرسال (بريد + واتساب)
          </>
        )}
      </button>

      <p className="mt-3 text-center text-xs text-brand-calm/70">
        يتم إرسال بياناتك للإدارة فور الضغط.
      </p>
    </form>
  );
}
