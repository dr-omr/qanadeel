import type { ReactNode } from "react";
import { PremiumCard } from "./PremiumCard";

export type InfoTableColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
};

type ResponsiveInfoTableProps<T> = {
  rows: T[];
  columns: InfoTableColumn<T>[];
  getRowKey: (row: T) => string;
  accent?: "deep" | "light";
};

export function ResponsiveInfoTable<T>({
  rows,
  columns,
  getRowKey,
  accent = "light",
}: ResponsiveInfoTableProps<T>) {
  return (
    <>
      <div className="grid gap-4 lg:hidden">
        {rows.map((row) => (
          <PremiumCard key={getRowKey(row)} className="p-5" variant="compact">
            <div className="space-y-4">
              {columns.map((column, index) => (
                <div
                  key={column.key}
                  className={
                    index === 0
                      ? "rounded-2xl bg-white px-4 py-3"
                      : "grid gap-1 border-t border-brand-line pt-4"
                  }
                >
                  <p className="text-xs font-extrabold text-brand-calm">
                    {column.header}
                  </p>
                  <div
                    className={`mt-1 text-base font-extrabold leading-8 text-brand-deep ${
                      column.className ?? ""
                    }`}
                  >
                    {column.render(row)}
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-[2rem] border border-brand-line bg-white/90 shadow-[0_20px_60px_rgba(16,64,45,0.08)] lg:block">
        <table className="w-full table-fixed text-right">
          <thead
            className={
              accent === "deep"
                ? "bg-brand-deep text-white"
                : "bg-[#eef5ee] text-brand-deep"
            }
          >
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-6 py-5 text-sm font-extrabold"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-line text-brand-calm">
            {rows.map((row) => (
              <tr
                key={getRowKey(row)}
                className="transition hover:bg-brand-ivory/70"
              >
                {columns.map((column, index) => (
                  <td
                    key={column.key}
                    className={`px-6 py-5 leading-8 ${
                      index === 0 ? "font-extrabold text-brand-deep" : ""
                    } ${column.className ?? ""}`}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
