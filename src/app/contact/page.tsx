import type { Metadata } from "next";
import { ContactSection } from "@/components/ContactSection";
import { schoolInfo } from "@/data/school-info";

export const metadata: Metadata = {
  title: `تواصل معنا | ${schoolInfo.shortName}`,
  description:
    "بيانات التواصل ونموذج واتساب وخريطة روضة قناديل العلم الخاصة للتعليم المبكر في سلطنة عمان.",
};

export default function ContactPage() {
  return (
    <main className="flex-1">
      <ContactSection />
    </main>
  );
}
