import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { schoolInfo } from "@/data/school-info";

export const metadata: Metadata = {
  title: `غير متصل | ${schoolInfo.shortName}`,
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-[80svh] flex-1 flex-col items-center justify-center px-6 text-center">
      {/* Icon */}
      <div className="mb-6 flex size-24 items-center justify-center rounded-[2rem] bg-brand-deep/8">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-deep/50" aria-hidden="true">
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      </div>

      {/* Logo */}
      <Image
        src={schoolInfo.logoMarkPath}
        alt={schoolInfo.shortName}
        width={56}
        height={56}
        className="mb-4 rounded-2xl border border-brand-line/40 bg-white p-1 shadow-sm"
      />

      <h1 className="text-2xl font-extrabold text-brand-deep">لا يوجد اتصال بالإنترنت</h1>
      <p className="mt-3 max-w-sm text-base leading-8 text-brand-calm">
        يبدو أنك غير متصل حالياً. تحقق من اتصالك وأعد المحاولة، أو تصفح الصفحات التي زرتها سابقاً.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-deep px-6 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          إعادة المحاولة
        </button>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-brand-line bg-white px-6 text-sm font-extrabold text-brand-deep shadow-sm transition hover:bg-brand-ivory"
        >
          الرئيسية
        </Link>
      </div>
    </main>
  );
}
