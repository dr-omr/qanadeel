"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Baby,
  CheckCircle,
  ClipboardList,
  GraduationCap,
  Mail,
  MessageCircle,
  Send,
  UserRound,
  XCircle,
} from "lucide-react";
import { schoolInfo } from "@/data/school-info";
import { buildWhatsappMessage, buildWhatsappUrl } from "@/lib/whatsapp";

type WizardData = {
  name: string;
  mobile: string;
  childAge: string;
  requestedStage: string;
  requestType: string;
  message: string;
};

type Step = {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
};

const steps: Step[] = [
  { id: 1, title: "من أنت؟", subtitle: "اسم ولي الأمر ورقم الجوال", icon: UserRound },
  { id: 2, title: "معلومات الطفل", subtitle: "عمر الطفل والمرحلة المطلوبة", icon: Baby },
  { id: 3, title: "نوع الطلب", subtitle: "ماذا تريد؟", icon: ClipboardList },
  { id: 4, title: "رسالتك", subtitle: "أي تفاصيل إضافية", icon: MessageCircle },
];

const inputClass =
  "w-full min-h-12 rounded-2xl border border-brand-line bg-brand-ivory px-4 text-base font-bold text-brand-deep outline-none transition focus:border-brand-deep focus:ring-4 focus:ring-brand-deep/10 placeholder:text-brand-calm/40";

export function ContactWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({
    name: "", mobile: "", childAge: "",
    requestedStage: schoolInfo.contactFormStages[0],
    requestType: schoolInfo.requestTypes[0],
    message: "أرغب ببدء تسجيل طفلي، وأعلم أن تأكيد التسجيل والمقاعد يتم عبر إدارة الروضة.",
  });
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  function update(field: keyof WizardData, value: string) {
    setData((d) => ({ ...d, [field]: value }));
    setError("");
  }

  function validateStep(): boolean {
    if (step === 1 && !data.name.trim()) { setError("يرجى كتابة اسمك."); return false; }
    if (step === 1 && !data.mobile.trim()) { setError("يرجى كتابة رقم الجوال."); return false; }
    return true;
  }

  function goNext() {
    if (!validateStep()) return;
    setDirection("forward");
    setStep((s) => Math.min(s + 1, steps.length));
  }

  function goBack() {
    setDirection("back");
    setStep((s) => Math.max(s - 1, 1));
    setError("");
  }

  async function handleSubmit() {
    setStatus("sending");

    // Send email
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      setStatus(json.success ? "success" : "error");
    } catch {
      setStatus("error");
    }

    // Open WhatsApp regardless
    const msg = buildWhatsappMessage({
      schoolName: schoolInfo.shortName,
      name: data.name,
      mobile: data.mobile,
      childAge: data.childAge,
      requestedStage: data.requestedStage,
      requestType: data.requestType,
      message: data.message,
    });
    window.open(
      buildWhatsappUrl(schoolInfo.whatsappInternational, msg),
      "_blank",
      "noopener,noreferrer",
    );
  }

  // ── Success ──
  if (status === "success" || status === "error") {
    return (
      <div className="flex flex-col items-center justify-center rounded-[2rem] bg-white px-6 py-14 text-center shadow-[0_24px_72px_rgba(16,64,45,0.10)]">
        {status === "success" ? (
          <CheckCircle className="size-16 text-emerald-500" />
        ) : (
          <XCircle className="size-16 text-orange-400" />
        )}
        <h3 className="mt-5 text-xl font-extrabold text-brand-deep">
          {status === "success" ? "تم الإرسال بنجاح! 🎉" : "تم فتح واتساب"}
        </h3>
        <p className="mt-3 max-w-xs text-sm leading-7 text-brand-calm">
          {status === "success"
            ? "وصلت رسالتك للإدارة عبر البريد. كما تم فتح واتساب لإكمال التواصل."
            : "فشل إرسال البريد، لكن تم فتح واتساب — يمكنك التواصل مباشرة."}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => { setStatus("idle"); setStep(1); setData({ name: "", mobile: "", childAge: "", requestedStage: schoolInfo.contactFormStages[0], requestType: schoolInfo.requestTypes[0], message: "أرغب بالاستفسار عن خدمات الروضة." }); }}
            className="rounded-full bg-brand-deep px-6 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#11382d]"
          >
            طلب جديد
          </button>
          <a
            href={`https://wa.me/${schoolInfo.whatsappInternational}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-brand-line px-6 py-2.5 text-sm font-extrabold text-brand-deep transition hover:bg-brand-ivory"
          >
            <MessageCircle className="size-4" />
            واتساب
          </a>
        </div>
      </div>
    );
  }

  const currentStep = steps[step - 1];
  const Icon = currentStep.icon;
  const progress = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="overflow-hidden rounded-[2rem] border border-brand-line/40 bg-white shadow-[0_24px_72px_rgba(16,64,45,0.10)]">
      {/* ── Header ── */}
      <div className="bg-brand-deep px-6 py-5">
        {/* Progress bar */}
        <div className="mb-4 h-1 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-brand-warm transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step pills */}
        <div className="flex items-center justify-between">
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-1">
              <div
                className={`flex size-8 items-center justify-center rounded-full text-xs font-extrabold transition-all duration-300 ${
                  s.id === step
                    ? "scale-110 bg-brand-warm text-brand-deep shadow-[0_0_0_3px_rgba(217,195,154,0.35)]"
                    : s.id < step
                    ? "bg-white/30 text-white"
                    : "bg-white/10 text-white/40"
                }`}
              >
                {s.id < step ? "✓" : s.id}
              </div>
            </div>
          ))}
        </div>

        {/* Current step title */}
        <div
          className="mt-5 flex items-center gap-3"
          key={step}
          style={{ animation: "slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <span className="flex size-10 items-center justify-center rounded-2xl bg-white/15">
            <Icon className="size-5 text-white" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-bold text-white/55">
              خطوة {step} من {steps.length}
            </p>
            <h3 className="text-lg font-extrabold text-white">{currentStep.title}</h3>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div
        className="px-6 py-6"
        key={`step-content-${step}`}
        style={{ animation: `${direction === "forward" ? "slideUp" : "slideDown"} 0.3s cubic-bezier(0.16, 1, 0.3, 1)` }}
      >
        {/* Error */}
        {error && (
          <div className="mb-4 rounded-2xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 ring-1 ring-red-200">
            {error}
          </div>
        )}

        {/* Step 1: Name + phone */}
        {step === 1 && (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold text-brand-deep">
                اسم ولي الأمر *
              </span>
              <input
                type="text"
                autoFocus
                value={data.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="محمد بن سالم"
                className={inputClass}
                autoComplete="name"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold text-brand-deep">
                رقم الجوال *
              </span>
              <input
                type="tel"
                value={data.mobile}
                onChange={(e) => update("mobile", e.target.value)}
                placeholder="9XXXXXXXX"
                className={inputClass}
                autoComplete="tel"
              />
            </label>
          </div>
        )}

        {/* Step 2: Child info */}
        {step === 2 && (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold text-brand-deep">عمر الطفل</span>
              <input
                type="text"
                autoFocus
                value={data.childAge}
                onChange={(e) => update("childAge", e.target.value)}
                placeholder="مثال: 4 سنوات"
                className={inputClass}
              />
            </label>
            <div>
              <p className="mb-3 text-sm font-extrabold text-brand-deep">المرحلة المطلوبة</p>
              <div className="grid gap-2">
                {schoolInfo.contactFormStages.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => update("requestedStage", s)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-extrabold transition-all ${
                      data.requestedStage === s
                        ? "border-brand-deep bg-brand-deep text-white"
                        : "border-brand-line bg-brand-ivory text-brand-deep hover:border-brand-calm"
                    }`}
                  >
                    <span>{s}</span>
                    {data.requestedStage === s && (
                      <span className="size-5 rounded-full bg-white/25 text-center text-xs leading-5">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Request type */}
        {step === 3 && (
          <div>
            <p className="mb-3 text-sm font-extrabold text-brand-deep">ماذا تريد؟</p>
            <div className="grid gap-3">
              {[
                { value: "تسجيل", icon: GraduationCap, desc: "تسجيل طفلك في الروضة" },
                { value: "زيارة", icon: UserRound, desc: "زيارة الروضة قبل التسجيل" },
                { value: "استفسار", icon: Mail, desc: "سؤال عام أو استفسار" },
              ].map((opt) => {
                const Ico = opt.icon;
                const active = data.requestType === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => update("requestType", opt.value)}
                    className={`flex items-center gap-4 rounded-2xl border p-4 text-right transition-all ${
                      active
                        ? "border-brand-deep bg-brand-deep text-white shadow-[0_8px_24px_rgba(23,72,58,0.18)]"
                        : "border-brand-line bg-brand-ivory text-brand-deep hover:border-brand-calm"
                    }`}
                  >
                    <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${active ? "bg-white/20" : "bg-brand-deep/8"}`}>
                      <Ico className={`size-5 ${active ? "text-brand-warm" : "text-brand-deep"}`} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-extrabold">{opt.value}</p>
                      <p className={`mt-0.5 text-xs ${active ? "text-white/70" : "text-brand-calm"}`}>{opt.desc}</p>
                    </div>
                    {active && <span className="shrink-0 text-brand-warm">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Message */}
        {step === 4 && (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold text-brand-deep">رسالتك</span>
              <textarea
                autoFocus
                rows={5}
                value={data.message}
                onChange={(e) => update("message", e.target.value)}
                className={`${inputClass} resize-none py-3 leading-8`}
              />
            </label>

            {/* Summary */}
            <div className="rounded-2xl bg-brand-ivory p-4 text-sm">
              <p className="mb-2 font-extrabold text-brand-deep">ملخص طلبك:</p>
              <div className="space-y-1 text-brand-calm">
                <p>👤 {data.name} — {data.mobile}</p>
                <p>🎂 {data.childAge || "لم يُحدد"} — {data.requestedStage}</p>
                <p>📋 {data.requestType}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer nav ── */}
      <div className="flex items-center justify-between gap-3 border-t border-brand-line/30 px-6 py-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 rounded-full border border-brand-line px-5 py-2.5 text-sm font-extrabold text-brand-calm transition hover:bg-brand-ivory"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            رجوع
          </button>
        ) : (
          <span />
        )}

        {step < steps.length ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-2 rounded-full bg-brand-deep px-6 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#11382d] active:scale-95"
          >
            التالي
            <span className="rotate-180">
              <ArrowLeft className="size-4" aria-hidden="true" />
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === "sending"}
            className="inline-flex items-center gap-2 rounded-full bg-brand-deep px-6 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            {status === "sending" ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                جارٍ الإرسال...
              </>
            ) : (
              <>
                <Send className="size-4" />
                إرسال الطلب
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
