"use client";

import {
  Check,
  EyeOff,
  Pencil,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Testimonial } from "@/lib/testimonials";

type Action =
  | "approve"
  | "reject"
  | "hide"
  | "feature"
  | "unfeature"
  | "delete"
  | "edit";

type CommentModerationActionsProps = {
  testimonial: Testimonial;
  busyAction?: Action;
  onAction: (action: Action) => void;
};

function ActionButton({
  label,
  action,
  tone = "neutral",
  busyAction,
  onAction,
  children,
}: {
  label: string;
  action: Action;
  tone?: "neutral" | "success" | "danger" | "gold";
  busyAction?: Action;
  onAction: (action: Action) => void;
  children: ReactNode;
}) {
  const tones = {
    neutral:
      "border-brand-line bg-white text-brand-deep hover:bg-brand-paper",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
    danger: "border-red-200 bg-red-50 text-red-800 hover:bg-red-100",
    gold: "border-brand-warm bg-brand-paper text-brand-deep hover:bg-[#f2e2c6]",
  };

  return (
    <button
      type="button"
      disabled={Boolean(busyAction)}
      onClick={() => onAction(action)}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full border px-3 text-xs font-extrabold transition disabled:cursor-wait disabled:opacity-65 ${tones[tone]}`}
      title={label}
    >
      {children}
      <span>{busyAction === action ? "جارٍ..." : label}</span>
    </button>
  );
}

export function CommentModerationActions({
  testimonial,
  busyAction,
  onAction,
}: CommentModerationActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {testimonial.status !== "approved" ? (
        <ActionButton
          label="اعتماد"
          action="approve"
          tone="success"
          busyAction={busyAction}
          onAction={onAction}
        >
          <Check className="size-4" aria-hidden="true" />
        </ActionButton>
      ) : null}

      {testimonial.status !== "rejected" ? (
        <ActionButton
          label="رفض"
          action="reject"
          tone="danger"
          busyAction={busyAction}
          onAction={onAction}
        >
          <X className="size-4" aria-hidden="true" />
        </ActionButton>
      ) : null}

      {testimonial.status !== "hidden" ? (
        <ActionButton
          label="إخفاء"
          action="hide"
          busyAction={busyAction}
          onAction={onAction}
        >
          <EyeOff className="size-4" aria-hidden="true" />
        </ActionButton>
      ) : null}

      {testimonial.status === "approved" ? (
        <ActionButton
          label={testimonial.isFeatured ? "إلغاء التمييز" : "تمييز"}
          action={testimonial.isFeatured ? "unfeature" : "feature"}
          tone="gold"
          busyAction={busyAction}
          onAction={onAction}
        >
          <Sparkles className="size-4" aria-hidden="true" />
        </ActionButton>
      ) : null}

      <ActionButton
        label="تعديل"
        action="edit"
        busyAction={busyAction}
        onAction={onAction}
      >
        <Pencil className="size-4" aria-hidden="true" />
      </ActionButton>

      <ActionButton
        label="حذف"
        action="delete"
        tone="danger"
        busyAction={busyAction}
        onAction={onAction}
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </ActionButton>
    </div>
  );
}

export type { Action as ModerationAction };
