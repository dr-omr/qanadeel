"use client";

import { useState } from "react";
import { Clock3, Contact, Save, Sparkles, UserRound, X } from "lucide-react";
import type { Testimonial, TestimonialRole } from "@/lib/testimonials";
import {
  formatArabicDate,
  testimonialRoleLabels,
} from "@/lib/testimonial-labels";
import { RatingStars } from "@/components/testimonials/RatingStars";
import { CommentStatusBadge } from "./CommentStatusBadge";
import {
  CommentModerationActions,
  type ModerationAction,
} from "./CommentModerationActions";

type AdminCommentCardProps = {
  testimonial: Testimonial;
  busyAction?: ModerationAction | "save";
  onModerate: (id: string, action: ModerationAction) => void;
  onUpdate: (
    id: string,
    values: {
      name: string;
      role: TestimonialRole;
      rating?: number;
      comment: string;
      contactInfo?: string;
    },
  ) => void;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export function AdminCommentCard({
  testimonial,
  busyAction,
  onModerate,
  onUpdate,
}: AdminCommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(testimonial.name);
  const [role, setRole] = useState<TestimonialRole>(testimonial.role);
  const [rating, setRating] = useState<number | undefined>(testimonial.rating);
  const [comment, setComment] = useState(testimonial.comment);
  const [contactInfo, setContactInfo] = useState(testimonial.contactInfo || "");

  function resetEdit() {
    setName(testimonial.name);
    setRole(testimonial.role);
    setRating(testimonial.rating);
    setComment(testimonial.comment);
    setContactInfo(testimonial.contactInfo || "");
    setIsEditing(false);
  }

  function handleAction(action: ModerationAction) {
    if (action === "edit") {
      setIsEditing(true);
      return;
    }

    onModerate(testimonial.id, action);
  }

  return (
    <article className="rounded-[1.75rem] border border-brand-line bg-white/94 p-5 text-brand-deep shadow-[0_18px_54px_rgba(23,72,58,0.08)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-deep text-sm font-extrabold text-white shadow-inner">
            {getInitials(testimonial.name) || (
              <UserRound className="size-5" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-extrabold">{testimonial.name}</h3>
              <CommentStatusBadge status={testimonial.status} />
              {testimonial.isFeatured ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-warm px-3 py-1 text-xs font-extrabold text-brand-deep">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  مميزة
                </span>
              ) : null}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-brand-calm">
              <span>{testimonialRoleLabels[testimonial.role]}</span>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="size-3.5" aria-hidden="true" />
                {formatArabicDate(testimonial.createdAt)}
              </span>
              {testimonial.contactInfo ? (
                <span className="inline-flex items-center gap-1">
                  <Contact className="size-3.5" aria-hidden="true" />
                  {testimonial.contactInfo}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <RatingStars rating={testimonial.rating} />
      </div>

      {isEditing ? (
        <div className="mt-5 grid gap-3 rounded-[1.5rem] border border-brand-line bg-brand-paper p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-extrabold text-brand-deep">
              الاسم
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-11 rounded-2xl border border-brand-line bg-white px-4 text-sm font-bold outline-none focus:border-brand-deep"
              />
            </label>
            <label className="grid gap-2 text-sm font-extrabold text-brand-deep">
              الصفة
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as TestimonialRole)}
                className="h-11 rounded-2xl border border-brand-line bg-white px-4 text-sm font-bold outline-none focus:border-brand-deep"
              >
                <option value="parent">ولي أمر</option>
                <option value="teacher">معلم</option>
                <option value="visitor">زائر</option>
              </select>
            </label>
          </div>
          <label className="grid gap-2 text-sm font-extrabold text-brand-deep">
            التقييم
            <select
              value={rating ?? ""}
              onChange={(event) =>
                setRating(event.target.value ? Number(event.target.value) : undefined)
              }
              className="h-11 rounded-2xl border border-brand-line bg-white px-4 text-sm font-bold outline-none focus:border-brand-deep"
            >
              <option value="">بدون تقييم</option>
              <option value="5">٥</option>
              <option value="4">٤</option>
              <option value="3">٣</option>
              <option value="2">٢</option>
              <option value="1">١</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-extrabold text-brand-deep">
            التعليق
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={4}
              className="min-h-28 rounded-2xl border border-brand-line bg-white px-4 py-3 text-sm font-bold leading-7 outline-none focus:border-brand-deep"
            />
          </label>
          <label className="grid gap-2 text-sm font-extrabold text-brand-deep">
            وسيلة التواصل الخاصة
            <input
              value={contactInfo}
              onChange={(event) => setContactInfo(event.target.value)}
              className="h-11 rounded-2xl border border-brand-line bg-white px-4 text-sm font-bold outline-none focus:border-brand-deep"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={Boolean(busyAction)}
              onClick={() =>
                onUpdate(testimonial.id, {
                  name,
                  role,
                  rating,
                  comment,
                  contactInfo: contactInfo || undefined,
                })
              }
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-brand-deep px-4 text-xs font-extrabold text-white transition hover:bg-[#11382d] disabled:cursor-wait disabled:bg-brand-calm"
            >
              <Save className="size-4" aria-hidden="true" />
              {busyAction === "save" ? "جارٍ الحفظ..." : "حفظ التعديل"}
            </button>
            <button
              type="button"
              onClick={resetEdit}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-brand-line bg-white px-4 text-xs font-extrabold text-brand-deep transition hover:bg-brand-paper"
            >
              <X className="size-4" aria-hidden="true" />
              إلغاء
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-5 break-words text-sm leading-8 text-brand-calm">
          {testimonial.comment}
        </p>
      )}

      <div className="mt-5 border-t border-brand-line pt-4">
        <CommentModerationActions
          testimonial={testimonial}
          busyAction={busyAction === "save" ? undefined : busyAction}
          onAction={handleAction}
        />
      </div>
    </article>
  );
}
