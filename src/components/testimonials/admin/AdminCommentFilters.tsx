"use client";

type FilterKey =
  | "all"
  | "pending"
  | "approved"
  | "rejected"
  | "hidden"
  | "featured";

type AdminCommentFiltersProps = {
  active: FilterKey;
  counts: Record<FilterKey, number>;
  onChange: (filter: FilterKey) => void;
};

const filters: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "الكل" },
  { key: "pending", label: "بانتظار المراجعة" },
  { key: "approved", label: "منشورة" },
  { key: "rejected", label: "مرفوضة" },
  { key: "hidden", label: "مخفية" },
  { key: "featured", label: "مميزة" },
];

export function AdminCommentFilters({
  active,
  counts,
  onChange,
}: AdminCommentFiltersProps) {
  return (
    <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
      {filters.map((filter) => (
        <button
          key={filter.key}
          type="button"
          aria-pressed={active === filter.key}
          onClick={() => onChange(filter.key)}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-brand-line bg-white px-4 text-sm font-extrabold text-brand-calm transition hover:bg-brand-paper hover:text-brand-deep aria-pressed:border-brand-deep aria-pressed:bg-brand-deep aria-pressed:text-white"
        >
          {filter.label}
          <span className="rounded-full bg-current/10 px-2 py-0.5 text-xs">
            {counts[filter.key] || 0}
          </span>
        </button>
      ))}
    </div>
  );
}

export type { FilterKey };
