"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  AlertCircle,
  Loader2,
  LockKeyhole,
  MessageSquarePlus,
  Send,
  ShieldCheck,
} from "lucide-react";
import type { TestimonialRole } from "@/lib/testimonials";
import { testimonialRoleLabels, arabicNumber } from "@/lib/testimonial-labels";
import { RatingStars } from "./RatingStars";
import { SubmitSuccessMessage } from "./SubmitSuccessMessage";

type FormErrors = Partial<
  Record<
    "name" | "role" | "rating" | "comment" | "contactInfo" | "consent" | "root",
    string
  >
>;

const roleOptions: TestimonialRole[] = ["parent", "teacher", "visitor"];
const maxCommentLength = 700;
const maxNameLength = 80;
const maxContactLength = 120;
const suspiciousPattern = /<|>|<\/|<script|javascript:|data:text\/html|on[a-z]+\s*=/i;
const urlPattern = /(https?:\/\/|www\.|[a-z0-9-]+\.[a-z]{2,})/i;

function validateForm({
  name,
  role,
  rating,
  comment,
  contactInfo,
  consent,
}: {
  name: string;
  role: TestimonialRole | "";
  rating?: number;
  comment: string;
  contactInfo: string;
  consent: boolean;
}) {
  const errors: FormErrors = {};
  const cleanName = name.trim();
  const cleanComment = comment.trim();
  const cleanContact = contactInfo.trim();

  if (!cleanName) errors.name = "يرجى كتابة الاسم.";
  if (cleanName.length > maxNameLength) {
    errors.name = "الاسم يجب ألا يتجاوز ٨٠ حرفًا.";
  }

  if (!role) errors.role = "يرجى اختيار الصفة.";

  if (rating !== undefined && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    errors.rating = "التقييم يجب أن يكون من ١ إلى ٥.";
  }

  if (cleanComment.length < 10) {
    errors.comment = "يرجى كتابة تعليق واضح من ١٠ أحرف على الأقل.";
  }

  if (cleanComment.length > maxCommentLength) {
    errors.comment = "التعليق يجب ألا يتجاوز ٧٠٠ حرف.";
  }

  if (cleanContact.length > maxContactLength) {
    errors.contactInfo = "بيانات التواصل يجب ألا تتجاوز ١٢٠ حرفًا.";
  }

  if (
    suspiciousPattern.test(cleanName) ||
    suspiciousPattern.test(cleanComment) ||
    suspiciousPattern.test(cleanContact) ||
    urlPattern.test(cleanName) ||
    urlPattern.test(cleanComment)
  ) {
    errors.comment =
      "لا يمكن إرسال روابط أو رموز برمجية داخل الاسم أو التعليق.";
  }

  if (!consent) {
    errors.consent = "يرجى الموافقة على إرسال الرأي للإدارة.";
  }

  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="mt-2 flex items-start gap-1.5 text-xs font-bold leading-6 text-red-700">
      <AlertCircle className="mt-1 size-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

export function CommentForm() {
  const [name, setName] = useState("");
  const [role, setRole] = useState<TestimonialRole | "">("parent");
  const [rating, setRating] = useState<number | undefined>(5);
  const [comment, setComment] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const charactersRemaining = useMemo(
    () => Math.max(0, maxCommentLength - comment.length),
    [comment.length],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    const nextErrors = validateForm({
      name,
      role,
      rating,
      comment,
      contactInfo,
      consent,
    });

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role,
          rating,
          comment,
          contactInfo,
          consent,
          website,
        }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(
          data.error || "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.",
        );
      }

      setIsSubmitted(true);
      setName("");
      setRole("parent");
      setRating(5);
      setComment("");
      setContactInfo("");
      setConsent(false);
      setWebsite("");
    } catch (error) {
      setErrors({
        root:
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return <SubmitSuccessMessage onReset={() => setIsSubmitted(false)} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-brand-line bg-white/94 p-5 text-brand-deep shadow-[0_30px_90px_rgba(23,72,58,0.14)] sm:p-6"
      noValidate
    >
      <div className="flex items-start gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-deep text-white shadow-inner">
          <MessageSquarePlus className="size-6" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold">شاركنا رأيك</h3>
          <p className="mt-2 text-sm leading-7 text-brand-calm">
            نسعد بسماع رأيكم وتجربتكم معنا. يتم مراجعة المشاركات قبل نشرها
            حفاظًا على جودة المحتوى وخصوصية مجتمع المدرسة.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <div>
          <label
            htmlFor="testimonial-name"
            className="text-sm font-extrabold text-brand-deep"
          >
            الاسم
          </label>
          <input
            id="testimonial-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={maxNameLength}
            required
            className="mt-2 h-12 w-full rounded-2xl border border-brand-line bg-brand-paper px-4 text-sm font-bold text-brand-deep outline-none transition placeholder:text-brand-calm/70 focus:border-brand-deep focus:bg-white focus:ring-4 focus:ring-brand-light/25"
            placeholder="مثال: أم محمد"
            aria-describedby={errors.name ? "testimonial-name-error" : undefined}
          />
          <div id="testimonial-name-error">
            <FieldError message={errors.name} />
          </div>
        </div>

        <div>
          <span className="text-sm font-extrabold text-brand-deep">الصفة</span>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {roleOptions.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={role === option}
                onClick={() => setRole(option)}
                className="min-h-11 rounded-2xl border border-brand-line bg-white px-3 text-xs font-extrabold text-brand-calm transition hover:border-brand-warm hover:text-brand-deep aria-pressed:border-brand-deep aria-pressed:bg-brand-deep aria-pressed:text-white"
              >
                {testimonialRoleLabels[option]}
              </button>
            ))}
          </div>
          <FieldError message={errors.role} />
        </div>

        <div>
          <span className="text-sm font-extrabold text-brand-deep">
            التقييم
          </span>
          <RatingStars
            rating={rating}
            interactive
            onChange={(value) => setRating(value)}
            className="mt-2"
          />
          <FieldError message={errors.rating} />
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="testimonial-comment"
              className="text-sm font-extrabold text-brand-deep"
            >
              التعليق
            </label>
            <span className="text-xs font-bold text-brand-calm">
              متبقي {arabicNumber.format(charactersRemaining)}
            </span>
          </div>
          <textarea
            id="testimonial-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={maxCommentLength}
            minLength={10}
            required
            rows={5}
            className="mt-2 min-h-36 w-full resize-y rounded-2xl border border-brand-line bg-brand-paper px-4 py-3 text-sm font-bold leading-8 text-brand-deep outline-none transition placeholder:text-brand-calm/70 focus:border-brand-deep focus:bg-white focus:ring-4 focus:ring-brand-light/25"
            placeholder="اكتب تجربتك أو انطباعك هنا بدون ذكر أسماء الأطفال أو أي معلومات خاصة."
          />
          <FieldError message={errors.comment} />
        </div>

        <div>
          <label
            htmlFor="testimonial-contact"
            className="text-sm font-extrabold text-brand-deep"
          >
            وسيلة تواصل اختيارية
          </label>
          <input
            id="testimonial-contact"
            value={contactInfo}
            onChange={(event) => setContactInfo(event.target.value)}
            maxLength={maxContactLength}
            className="mt-2 h-12 w-full rounded-2xl border border-brand-line bg-brand-paper px-4 text-sm font-bold text-brand-deep outline-none transition placeholder:text-brand-calm/70 focus:border-brand-deep focus:bg-white focus:ring-4 focus:ring-brand-light/25"
            placeholder="رقم هاتف أو بريد للإدارة فقط"
          />
          <p className="mt-2 flex items-start gap-1.5 text-xs font-bold leading-6 text-brand-calm">
            <LockKeyhole className="mt-1 size-3.5 shrink-0" aria-hidden="true" />
            لا تظهر وسيلة التواصل للزوار، وتستخدم للمتابعة الإدارية فقط.
          </p>
          <FieldError message={errors.contactInfo} />
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-brand-line bg-brand-paper px-4 py-3 text-sm font-bold leading-7 text-brand-calm">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-1 size-4 shrink-0 accent-brand-deep"
          />
          <span>
            أوافق على إرسال رأيي لإدارة المدرسة، وأعلم أنه لن يظهر في الموقع
            إلا بعد المراجعة.
          </span>
        </label>
        <FieldError message={errors.consent} />

        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          className="hidden"
          aria-hidden="true"
        />

        {errors.root ? (
          <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-7 text-red-700">
            <AlertCircle className="mt-1 size-4 shrink-0" aria-hidden="true" />
            {errors.root}
          </div>
        ) : null}

        <div className="flex items-start gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-bold leading-6 text-brand-calm shadow-sm">
          <ShieldCheck className="mt-1 size-4 shrink-0 text-brand-deep" />
          لا نطلب أسماء الأطفال أو أي بيانات حساسة، ولا يتم نشر أي مشاركة قبل
          اعتمادها.
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-deep px-6 text-sm font-extrabold text-white shadow-[0_18px_42px_rgba(23,72,58,0.22)] transition hover:-translate-y-0.5 hover:bg-[#11382d] disabled:cursor-not-allowed disabled:bg-brand-calm disabled:hover:translate-y-0"
        >
          {isSubmitting ? (
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="size-5" aria-hidden="true" />
          )}
          إرسال الرأي للمراجعة
        </button>
      </div>
    </form>
  );
}
