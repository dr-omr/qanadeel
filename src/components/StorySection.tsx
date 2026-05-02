"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */
const moments = [
  {
    id: 1,
    emoji: "🌅",
    label: "الوصول",
    title: "استقبال دافئ كل صباح",
    text: "يبدأ يوم طفلك بوجوه مألوفة — ابتسامة المعلمة وسلام الأصدقاء يصنعان أماناً يشتاق له.",
    src: "/images/school-gallery/classrooms/first-day-girls-01.jpeg",
    color: "#22c55e",
    badge: "bg-emerald-500/20 text-emerald-200",
  },
  {
    id: 2,
    emoji: "📚",
    label: "التعلم",
    title: "اكتشاف بيئة التعلم",
    text: "صفوف مجهزة بأدوات حقيقية لعمر الطفل — تعلم بالتجربة والاكتشاف، لا بالحفظ والتلقين.",
    src: "/images/school-gallery/events/national-day-celebration-01.jpeg",
    color: "#38bdf8",
    badge: "bg-sky-500/20 text-sky-200",
  },
  {
    id: 3,
    emoji: "🎨",
    label: "الإبداع",
    title: "فن يُعبّر عن الذات",
    text: "نُعطي كل طفل أدواته — الألوان والأوراق والمسرح. نحتفي بكل محاولة لأن الإبداع لا يُخطئ.",
    src: "/images/school-gallery/events/national-day-art-01.jpeg",
    color: "#f59e0b",
    badge: "bg-amber-500/20 text-amber-200",
  },
  {
    id: 4,
    emoji: "🎓",
    label: "الإنجاز",
    title: "لحظة تكلّل العام",
    text: "حفل التخرج ليس نهاية — بل بداية ثقة جديدة. ابتسامة طفلك هي أكبر شهاداتنا.",
    src: "/images/school-gallery/events/graduation-ceremony-01.jpeg",
    color: "#d946ef",
    badge: "bg-fuchsia-500/20 text-fuchsia-200",
  },
];

/* ═══════════════════════════════════════════════════════════
   TIMING
   ═══════════════════════════════════════════════════════════ */
const FILL_MS     = 6000;  // bar fills over 6 seconds
const HOLD_MS     = 800;   // bar stays full before transitioning
const CROSSFADE   = 1400;  // CSS crossfade duration (ms)
const TICK        = 50;    // progress update interval
const TOTAL_TICKS = FILL_MS / TICK;

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */
export function StorySection() {
  const [active,    setActive]    = useState(0);
  const [progress,  setProgress]  = useState(0);
  const [held,      setHeld]      = useState(false);   // true = bar is at 100%, holding
  const [isVisible, setIsVisible] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const holdTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs to avoid stale closures inside setInterval
  const activeRef = useRef(active);
  const heldRef   = useRef(held);
  activeRef.current = active;
  heldRef.current   = held;

  /* ── Visibility tracking ── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setIsVisible(e.isIntersecting),
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ── Advance to next slide ── */
  const advance = useCallback((nextIdx: number) => {
    // Just change active — CSS transition: opacity handles the crossfade
    setActive(nextIdx);
    activeRef.current = nextIdx;
    setHeld(false);
    heldRef.current = false;
    setProgress(0);
  }, []);

  /* ── Main timer: fills the bar, holds, then advances ── */
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      // Don't increment while holding
      if (heldRef.current) return;

      setProgress((p) => {
        const next = p + (100 / TOTAL_TICKS);
        if (next >= 100) {
          // Bar just filled — start hold phase
          setHeld(true);
          heldRef.current = true;

          // After HOLD_MS, advance (CSS crossfade handles the visual)
          holdTimer.current = setTimeout(() => {
            const nextSlide = (activeRef.current + 1) % moments.length;
            advance(nextSlide);
          }, HOLD_MS);

          return 100;
        }
        return next;
      });
    }, TICK);

    return () => {
      clearInterval(interval);
      if (holdTimer.current) clearTimeout(holdTimer.current);
    };
  }, [isVisible, advance]);

  /* ── Manual navigation ── */
  const goTo = useCallback((idx: number) => {
    if (idx === activeRef.current) return;
    if (holdTimer.current) clearTimeout(holdTimer.current);
    advance(idx);
  }, [advance]);

  /* ── Cleanup ── */
  useEffect(() => () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
  }, []);

  const m = moments[active];

  /* ═══════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════ */
  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-brand-deep via-[#143e32] to-brand-deep"
    >
      {/* ── Ambient color glow ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 65% 55% at 50% 65%, ${m.color}1a 0%, transparent 70%)`,
          transition: `background ${CROSSFADE}ms ease-in-out`,
        }}
      />

      {/* Edge lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-brand-warm/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-brand-warm/30 to-transparent" />

      <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">

        {/* ── Section heading ── */}
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-warm/25 bg-brand-warm/8 px-4 py-1.5 text-xs font-extrabold text-brand-warm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-warm opacity-40" />
              <span className="relative inline-flex size-2 rounded-full bg-brand-warm" />
            </span>
            يوم طفلك في الروضة
          </span>
          <h2 className="mt-4 text-[clamp(1.4rem,4vw,2.4rem)] font-extrabold text-white">
            أربع لحظات تصنع طفولة
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-white/45">
            من لحظة الوصول حتى الإنجاز — كل يوم قصة جديدة
          </p>
        </div>

        {/* ═══════════════════════════════════════════
            MAIN CINEMATIC CARD
            ═══════════════════════════════════════════ */}
        <div
          className="relative mb-8 overflow-hidden rounded-[2.5rem] border border-white/8 shadow-[0_32px_80px_rgba(0,0,0,0.45)]"
          style={{ isolation: "isolate", WebkitBackfaceVisibility: "hidden", backfaceVisibility: "hidden" }}
        >
          <div className="relative aspect-[16/7] w-full sm:aspect-[16/6] lg:aspect-[21/8]">

            {/* ── ALL 4 images always in DOM — CSS opacity does the crossfade ── */}
            {moments.map((moment, i) => (
              <div
                key={moment.id}
                className="absolute inset-0"
                style={{
                  opacity: i === active ? 1 : 0,
                  zIndex:  i === active ? 2 : 1,
                  transition: `opacity ${CROSSFADE}ms ease-in-out`,
                }}
              >
                {/* Ken Burns: subtle zoom-out over the slide's lifetime */}
                <div
                  className="absolute inset-0"
                  style={{
                    animation: i === active
                      ? `kenBurns ${FILL_MS + HOLD_MS + CROSSFADE}ms ease-out forwards`
                      : "none",
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <Image
                    src={moment.src}
                    alt={moment.label}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={i < 2}
                  />
                </div>
              </div>
            ))}

            {/* ── Fixed cinematic overlays ── */}
            <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-black/90 via-black/25 to-black/5" />
            <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-r from-black/55 via-transparent to-transparent" />

            {/* ── Text overlay — re-animates via key ── */}
            <div className="absolute inset-0 z-[4] flex flex-col justify-end p-6 sm:p-8 lg:p-10">
              <div
                key={active}
                className="max-w-2xl"
                style={{ animation: "slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both" }}
              >
                {/* Step badge */}
                <span className={`mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.65rem] font-extrabold backdrop-blur-sm ${m.badge}`}>
                  {m.emoji} الخطوة {String(active + 1).padStart(2, "0")} من {moments.length}
                </span>

                {/* Title */}
                <h3 className="text-[clamp(1.3rem,4vw,2.2rem)] font-extrabold leading-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                  {m.title}
                </h3>

                {/* Description */}
                <p className="mt-3 max-w-xl text-sm leading-8 text-white/75 sm:text-base">
                  {m.text}
                </p>
              </div>
            </div>

            {/* ── Progress bar at bottom ── */}
            <div className="absolute inset-x-0 bottom-0 z-[5] h-[3px] bg-white/10">
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: m.color,
                  boxShadow: `0 0 10px ${m.color}90`,
                  transition: held
                    ? "none"
                    : `width ${TICK + 5}ms linear, background ${CROSSFADE}ms ease`,
                }}
              />
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            THUMBNAIL SELECTORS
            ═══════════════════════════════════════════ */}
        <div className="flex items-end justify-center gap-3 sm:gap-5">
          {moments.map((moment, i) => {
            const isCurrent = i === active;
            const isPast    = i < active;

            return (
              <button
                key={moment.id}
                type="button"
                onClick={() => goTo(i)}
                className="group flex flex-col items-center gap-2 outline-none"
                aria-label={moment.label}
              >
                {/* Thumbnail image */}
                <div
                  className={`relative shrink-0 overflow-hidden rounded-2xl ${
                    isCurrent
                      ? "size-16 sm:size-20 lg:size-24"
                      : "size-12 sm:size-14 lg:size-16"
                  }`}
                  style={{
                    border: `2px solid ${
                      isCurrent
                        ? moment.color
                        : isPast
                          ? "rgba(255,255,255,0.22)"
                          : "rgba(255,255,255,0.08)"
                    }`,
                    boxShadow: isCurrent ? `0 0 22px ${moment.color}50` : "none",
                    transition: "all 0.55s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <Image
                    src={moment.src}
                    alt={moment.label}
                    fill
                    sizes="96px"
                    className={`object-cover transition-all duration-500 ${
                      isCurrent
                        ? "scale-100 brightness-100"
                        : "scale-110 brightness-[0.38] group-hover:brightness-55"
                    }`}
                  />

                  {/* SVG progress ring — only on active */}
                  {isCurrent && (
                    <svg
                      className="pointer-events-none absolute inset-0 size-full overflow-visible"
                      viewBox="0 0 100 100"
                      style={{ transform: "rotate(-90deg)" }}
                      aria-hidden="true"
                    >
                      <circle
                        cx="50" cy="50" r="47"
                        fill="none"
                        stroke="rgba(255,255,255,0.07)"
                        strokeWidth="2.5"
                      />
                      <circle
                        cx="50" cy="50" r="47"
                        fill="none"
                        stroke={moment.color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 47}`}
                        strokeDashoffset={`${2 * Math.PI * 47 * (1 - progress / 100)}`}
                        style={{
                          transition: held
                            ? "none"
                            : `stroke-dashoffset ${TICK + 5}ms linear`,
                          filter: `drop-shadow(0 0 4px ${moment.color})`,
                        }}
                      />
                    </svg>
                  )}

                  {/* Emoji overlay on inactive */}
                  {!isCurrent && (
                    <div className="absolute inset-0 flex items-center justify-center text-xl opacity-70 transition-opacity duration-300 group-hover:opacity-100">
                      {moment.emoji}
                    </div>
                  )}
                </div>

                {/* Label */}
                <span
                  className="text-[0.65rem] font-extrabold sm:text-xs"
                  style={{
                    color: isCurrent ? moment.color : "rgba(255,255,255,0.28)",
                    transition: "color 0.5s ease",
                  }}
                >
                  {moment.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════
            NAVIGATION CONTROLS
            ═══════════════════════════════════════════ */}
        <div className="mt-6 flex items-center justify-center gap-3">
          {/* Previous */}
          <button
            type="button"
            onClick={() => goTo((active - 1 + moments.length) % moments.length)}
            className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white/50 transition-all duration-200 hover:border-white/35 hover:text-white active:scale-90"
            aria-label="السابق"
          >
            →
          </button>

          {/* Dot indicators */}
          <div className="flex gap-1.5">
            {moments.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className="rounded-full"
                style={{
                  background:  i === active ? m.color : "rgba(255,255,255,0.18)",
                  width:       i === active ? "28px" : "8px",
                  height:      "8px",
                  boxShadow:   i === active ? `0 0 8px ${m.color}` : "none",
                  transition:  "all 0.5s ease",
                }}
                aria-label={`انتقل للخطوة ${i + 1}`}
              />
            ))}
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={() => goTo((active + 1) % moments.length)}
            className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white/50 transition-all duration-200 hover:border-white/35 hover:text-white active:scale-90"
            aria-label="التالي"
          >
            ←
          </button>
        </div>

      </div>
    </section>
  );
}
