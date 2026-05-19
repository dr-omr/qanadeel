"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import {
  AlertCircle,
  KeyRound,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import type { Testimonial } from "@/lib/testimonials";
import { arabicNumber } from "@/lib/testimonial-labels";
import { AdminCommentCard } from "./AdminCommentCard";
import {
  AdminCommentFilters,
  type FilterKey,
} from "./AdminCommentFilters";
import type { ModerationAction } from "./CommentModerationActions";

type AdminResponse = {
  testimonials?: Testimonial[];
  error?: string;
};

type BusyKey = `${string}:${ModerationAction | "save"}`;

const countLabels: Record<FilterKey, string> = {
  all: "الكل",
  pending: "بانتظار المراجعة",
  approved: "منشورة",
  rejected: "مرفوضة",
  hidden: "مخفية",
  featured: "مميزة",
};

function buildCounts(testimonials: Testimonial[]) {
  return {
    all: testimonials.length,
    pending: testimonials.filter((item) => item.status === "pending").length,
    approved: testimonials.filter((item) => item.status === "approved").length,
    rejected: testimonials.filter((item) => item.status === "rejected").length,
    hidden: testimonials.filter((item) => item.status === "hidden").length,
    featured: testimonials.filter((item) => item.isFeatured).length,
  };
}

export function AdminCommentsPanel() {
  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("pending");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<BusyKey | null>(null);

  const counts = useMemo(() => buildCounts(testimonials), [testimonials]);

  const filteredTestimonials = useMemo(() => {
    if (activeFilter === "all") return testimonials;
    if (activeFilter === "featured") {
      return testimonials.filter((testimonial) => testimonial.isFeatured);
    }

    return testimonials.filter(
      (testimonial) => testimonial.status === activeFilter,
    );
  }, [activeFilter, testimonials]);

  const loadTestimonials = useCallback(async (adminToken = token) => {
    if (!adminToken) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/testimonials", {
        headers: { "x-admin-token": adminToken },
        cache: "no-store",
      });
      const data = (await response.json()) as AdminResponse;

      if (!response.ok) {
        throw new Error(data.error || "تعذر تحميل المشاركات.");
      }

      setTestimonials(data.testimonials || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تحميل المشاركات.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanToken = tokenInput.trim();

    if (!cleanToken) {
      setError("يرجى إدخال رمز الإدارة.");
      return;
    }

    setToken(cleanToken);
    void loadTestimonials(cleanToken);
  }

  function logout() {
    setToken("");
    setTokenInput("");
    setTestimonials([]);
  }

  async function handleModerate(id: string, action: ModerationAction) {
    if (action === "delete") {
      const confirmed = window.confirm(
        "هل أنت متأكد من حذف هذه المشاركة نهائيًا؟",
      );

      if (!confirmed) return;
    }

    const nextBusyKey: BusyKey = `${id}:${action}`;
    setBusyKey(nextBusyKey);
    setError(null);

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: action === "delete" ? "DELETE" : "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body:
          action === "delete"
            ? undefined
            : JSON.stringify({
                action,
              }),
      });
      const data = (await response.json()) as AdminResponse & {
        testimonial?: Testimonial;
      };

      if (!response.ok) {
        throw new Error(data.error || "تعذر تنفيذ الإجراء.");
      }

      if (action === "delete") {
        setTestimonials((current) =>
          current.filter((testimonial) => testimonial.id !== id),
        );
      } else if (data.testimonial) {
        setTestimonials((current) =>
          current.map((testimonial) =>
            testimonial.id === id ? data.testimonial as Testimonial : testimonial,
          ),
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تنفيذ الإجراء.");
    } finally {
      setBusyKey(null);
    }
  }

  async function handleUpdate(
    id: string,
    values: {
      name: string;
      role: Testimonial["role"];
      rating?: number;
      comment: string;
      contactInfo?: string;
    },
  ) {
    const nextBusyKey: BusyKey = `${id}:save`;
    setBusyKey(nextBusyKey);
    setError(null);

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({
          action: "update",
          ...values,
        }),
      });
      const data = (await response.json()) as AdminResponse & {
        testimonial?: Testimonial;
      };

      if (!response.ok || !data.testimonial) {
        throw new Error(data.error || "تعذر حفظ التعديل.");
      }

      setTestimonials((current) =>
        current.map((testimonial) =>
          testimonial.id === id ? data.testimonial as Testimonial : testimonial,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حفظ التعديل.");
    } finally {
      setBusyKey(null);
    }
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-xl rounded-[2rem] border border-brand-line bg-white/94 p-6 text-brand-deep shadow-[0_28px_82px_rgba(23,72,58,0.14)]">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-deep text-white shadow-inner">
          <KeyRound className="size-7" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-2xl font-extrabold">دخول لوحة إدارة الآراء</h2>
        <p className="mt-3 text-sm leading-7 text-brand-calm">
          أدخل رمز الإدارة لمراجعة المشاركات واعتماد ما يظهر للعامة. في بيئة
          التطوير يمكن استخدام الرمز الافتراضي dev-admin ما لم يتم ضبط متغير
          البيئة.
        </p>
        <form onSubmit={handleLogin} className="mt-6 grid gap-3">
          <label
            htmlFor="admin-token"
            className="text-sm font-extrabold text-brand-deep"
          >
            رمز الإدارة
          </label>
          <input
            id="admin-token"
            type="password"
            value={tokenInput}
            onChange={(event) => setTokenInput(event.target.value)}
            className="h-12 rounded-2xl border border-brand-line bg-brand-paper px-4 text-sm font-bold outline-none focus:border-brand-deep focus:bg-white"
            placeholder="TESTIMONIALS_ADMIN_TOKEN"
          />
          {error ? (
            <p className="flex items-center gap-2 text-sm font-bold text-red-700">
              <AlertCircle className="size-4" aria-hidden="true" />
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-deep px-6 text-sm font-extrabold text-white transition hover:bg-[#11382d]"
          >
            دخول
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 rounded-[2rem] border border-brand-line bg-white/94 p-5 text-brand-deep shadow-[0_24px_76px_rgba(23,72,58,0.12)] lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-extrabold text-brand-calm">
            <ShieldCheck className="size-4" aria-hidden="true" />
            إدارة آراء المجتمع
          </p>
          <h2 className="mt-2 text-2xl font-extrabold">
            المشاركات الواردة والمراجعة
          </h2>
          <p className="mt-2 text-sm leading-7 text-brand-calm">
            راجع المشاركات، صحح الأخطاء البسيطة، ثم اعتمد ما يناسب الظهور في
            الموقع العام.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void loadTestimonials()}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-brand-line bg-white px-4 text-sm font-extrabold text-brand-deep transition hover:bg-brand-paper"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <RefreshCw className="size-4" aria-hidden="true" />
            )}
            تحديث
          </button>
          <button
            type="button"
            onClick={logout}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 text-sm font-extrabold text-red-800 transition hover:bg-red-100"
          >
            خروج
          </button>
        </div>
      </div>

      <AdminCommentFilters
        active={activeFilter}
        counts={counts}
        onChange={setActiveFilter}
      />

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Object.entries(counts).map(([key, value]) => (
          <div
            key={key}
            className="rounded-[1.25rem] border border-brand-line bg-white/90 p-4 shadow-sm"
          >
            <p className="text-xs font-extrabold text-brand-calm">
              {countLabels[key as FilterKey]}
            </p>
            <p className="mt-2 text-2xl font-extrabold text-brand-deep">
              {arabicNumber.format(value)}
            </p>
          </div>
        ))}
      </div>

      {error ? (
        <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-7 text-red-700">
          <AlertCircle className="mt-1 size-4 shrink-0" aria-hidden="true" />
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-[2rem] border border-brand-line bg-white/80 p-8 text-center text-sm font-extrabold text-brand-calm">
          جارٍ تحميل المشاركات...
        </div>
      ) : null}

      {!isLoading && filteredTestimonials.length ? (
        <div className="grid gap-4">
          {filteredTestimonials.map((testimonial) => {
            const [, action] =
              busyKey?.startsWith(`${testimonial.id}:`)
                ? busyKey.split(":")
                : [];

            return (
              <AdminCommentCard
                key={`${testimonial.id}-${testimonial.updatedAt || testimonial.createdAt}`}
                testimonial={testimonial}
                busyAction={action as ModerationAction | "save" | undefined}
                onModerate={handleModerate}
                onUpdate={handleUpdate}
              />
            );
          })}
        </div>
      ) : null}

      {!isLoading && !filteredTestimonials.length ? (
        <div className="rounded-[2rem] border border-dashed border-brand-calm/45 bg-white/74 p-8 text-center shadow-sm">
          <h3 className="text-xl font-extrabold text-brand-deep">
            لا توجد مشاركات ضمن هذا التصنيف
          </h3>
          <p className="mt-3 text-sm leading-7 text-brand-calm">
            عند وصول مشاركات جديدة ستظهر هنا حسب حالتها.
          </p>
        </div>
      ) : null}
    </div>
  );
}
