"use client";

import { useEffect, useState } from "react";
import type { Review } from "@/app/api/reviews/route";

/* ═══════════════════════════════════════════════════════════
   VISUAL ARRAYS — each review card gets a unique accent
   ═══════════════════════════════════════════════════════════ */
const gradients = [
  "from-emerald-500 to-emerald-700",
  "from-sky-500 to-sky-700",
  "from-amber-500 to-amber-700",
  "from-violet-500 to-violet-700",
  "from-rose-500 to-rose-700",
  "from-teal-500 to-teal-700",
];

const accentBorders = [
  "border-t-emerald-400",
  "border-t-sky-400",
  "border-t-amber-400",
  "border-t-violet-400",
  "border-t-rose-400",
  "border-t-teal-400",
];

/* ═══════════════════════════════════════════════════════════
   STAR COMPONENTS
   ═══════════════════════════════════════════════════════════ */
function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-base ${i < rating ? "text-amber-400" : "text-brand-line"}`}>★</span>
      ))}
    </div>
  );
}

function StarInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="text-2xl transition-all duration-150 hover:scale-125 active:scale-95"
          aria-label={`${n} نجوم`}
        >
          <span className={(hover || value) >= n ? "text-amber-400" : "text-brand-line"}>★</span>
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   REVIEW CARD — accent top border, serif quote, stars+author
   ═══════════════════════════════════════════════════════════ */
function ReviewCard({ review, index }: { review: Review; index: number }) {
  const grad   = gradients[index % gradients.length];
  const accent = accentBorders[index % accentBorders.length];

  return (
    <div
      className={`group flex flex-col gap-4 rounded-[1.75rem] border border-brand-line/25 border-t-2 ${accent} bg-white p-6 shadow-[0_4px_24px_rgba(23,72,58,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(23,72,58,0.10)]`}
      style={{ animation: `slideUp 0.5s ${index * 0.07}s cubic-bezier(0.16,1,0.3,1) both` }}
    >
      {/* Decorative serif quote mark */}
      <div
        className="select-none text-5xl font-extrabold leading-none text-brand-line/30 transition-colors duration-300 group-hover:text-brand-line/50"
        style={{ fontFamily: "Georgia, serif" }}
      >
        ❝
      </div>

      {/* Review text */}
      <p className="flex-1 text-sm leading-8 text-brand-calm">{review.text}</p>

      {/* Author + stars row */}
      <div className="flex items-center justify-between border-t border-brand-line/20 pt-4">
        <div className="flex items-center gap-3">
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-extrabold text-white shadow-sm ${grad}`}>
            {review.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-extrabold text-brand-deep">{review.name}</p>
            <p className="text-[0.65rem] text-brand-calm/55">{review.stage} · {review.date}</p>
          </div>
        </div>
        <StarRow rating={review.rating} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUBMIT FORM — sticky on desktop
   ═══════════════════════════════════════════════════════════ */
function SubmitForm({ onSuccess }: { onSuccess: (r: Review) => void }) {
  const [name,   setName]   = useState("");
  const [stage,  setStage]  = useState("روضة");
  const [rating, setRating] = useState(5);
  const [text,   setText]   = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setStatus("sending");
    try {
      const res  = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, stage, rating, text }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("done");
        onSuccess(json.review);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-[2rem] bg-emerald-50 p-8 text-center ring-1 ring-emerald-200">
        <div className="text-4xl">🎉</div>
        <p className="mt-3 text-lg font-extrabold text-brand-deep">شكراً لك!</p>
        <p className="mt-2 text-sm text-brand-calm">رأيك ظهر للزوار فوراً.</p>
        <button
          type="button"
          onClick={() => { setStatus("idle"); setName(""); setText(""); setRating(5); }}
          className="mt-5 rounded-full bg-brand-deep px-6 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#11382d]"
        >
          إضافة رأي آخر
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-[2rem] border border-brand-line/30 bg-white p-6 shadow-[0_8px_32px_rgba(23,72,58,0.06)] lg:p-7"
    >
      {/* Form header */}
      <h3 className="text-base font-extrabold text-brand-deep">شارك تجربتك مع الروضة</h3>
      <p className="mt-1 text-xs text-brand-calm/70">رأيك الحقيقي يساعد أولياء الأمور الآخرين.</p>

      <div className="mt-5 space-y-3.5">
        {/* Name */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="اسمك *"
          className="w-full rounded-2xl border border-brand-line/50 bg-brand-ivory px-4 py-3 text-sm font-bold text-brand-deep outline-none transition focus:border-brand-deep focus:ring-2 focus:ring-brand-deep/10"
        />

        {/* Stage */}
        <select
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="w-full appearance-none rounded-2xl border border-brand-line/50 bg-brand-ivory px-4 py-3 text-sm font-bold text-brand-deep outline-none transition focus:border-brand-deep focus:ring-2 focus:ring-brand-deep/10"
        >
          <option>روضة</option>
          <option>تمهيدي</option>
          <option>ولي أمر</option>
        </select>

        {/* Rating */}
        <div>
          <p className="mb-2 text-xs font-extrabold text-brand-calm">التقييم</p>
          <StarInput value={rating} onChange={setRating} />
        </div>

        {/* Text */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={4}
          placeholder="اكتب تجربتك..."
          className="w-full resize-none rounded-2xl border border-brand-line/50 bg-brand-ivory px-4 py-3 text-sm font-bold leading-7 text-brand-deep outline-none transition focus:border-brand-deep focus:ring-2 focus:ring-brand-deep/10"
        />
      </div>

      {/* Error */}
      {status === "error" && (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-2 text-xs font-bold text-red-600">
          حدث خطأ — حاول مجدداً.
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-deep py-3 text-sm font-extrabold text-white transition-all duration-300 hover:bg-[#11382d] hover:shadow-[0_8px_24px_rgba(23,72,58,0.2)] disabled:opacity-60"
      >
        {status === "sending" ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            جارٍ النشر...
          </>
        ) : (
          "نشر رأيي"
        )}
      </button>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN SECTION
   ═══════════════════════════════════════════════════════════ */
export function LiveReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => { setReviews(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const addReview = (r: Review) => setReviews((prev) => [r, ...prev]);

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section className="bg-brand-ivory px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">

        {/* ── Header ── */}
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-50 px-4 py-1.5 text-xs font-extrabold text-amber-700">
            <span className="size-1.5 rounded-full bg-amber-400" />
            آراء أولياء الأمور
          </span>
          <h2 className="mt-4 text-[clamp(1.4rem,4vw,2.2rem)] font-extrabold text-brand-deep">
            ماذا يقول أهالي طلابنا؟
          </h2>
          {avg && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="text-2xl font-extrabold text-brand-deep">{avg}</span>
              <div className="flex gap-0.5 text-lg text-amber-400">{"★".repeat(5)}</div>
              <span className="text-xs text-brand-calm/60">({reviews.length} تقييم)</span>
            </div>
          )}
        </div>

        {/* ── Two-column layout: form + reviews ── */}
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">

          {/* Form — sticky on desktop */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SubmitForm onSuccess={addReview} />
          </div>

          {/* Reviews grid */}
          <div>
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-52 animate-pulse rounded-[1.75rem] bg-brand-line/15" />
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-brand-line py-20 text-center">
                <div className="text-5xl">💬</div>
                <p className="mt-4 text-base font-extrabold text-brand-deep">لا توجد آراء بعد</p>
                <p className="mt-2 text-sm text-brand-calm/70">كن أول من يشارك تجربته مع الروضة!</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {reviews.map((r, i) => (
                  <ReviewCard key={r.id} review={r} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
