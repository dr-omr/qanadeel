import type { Metadata } from "next";
import { schoolInfo } from "@/data/school-info";
import { GalleryPageClient } from "./GalleryPageClient";

export const metadata: Metadata = {
  title: `معرض الصور | ${schoolInfo.shortName}`,
  description:
    "معرض صور روضة قناديل العلم الخاصة للتعليم المبكر — لمحات من بيئة التعلم، الأنشطة، اللعب، الفعاليات، والمرافق.",
};

export default function GalleryPage() {
  return (
    <main className="flex-1">
      <GalleryPageClient />
    </main>
  );
}
