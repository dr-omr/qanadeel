import { schoolInfo, type SchoolClass } from "@/data/school-info";
import { ResponsiveInfoTable } from "./ResponsiveInfoTable";
import { SectionHeader } from "./SectionHeader";

const columns = [
  {
    key: "stage",
    header: "المرحلة",
    render: (row: SchoolClass) => row.stage,
  },
  {
    key: "count",
    header: "عدد الصفوف",
    render: (row: SchoolClass) => `${row.count} صف`,
  },
  {
    key: "notes",
    header: "ملاحظات",
    render: (row: SchoolClass) => row.notes,
  },
];

export function ClassesSection() {
  return (
    <section id="classes" className="bg-brand-paper px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="الصفوف المرخصة"
          title="بيانات الصفوف الدراسية"
          description="توضح البيانات التالية المراحل والصفوف المتاحة حاليًا في الروضة ضمن نطاق الإفصاح الرسمي."
        />

        <ResponsiveInfoTable
          rows={schoolInfo.classes}
          columns={columns}
          getRowKey={(row) => row.stage}
        />
      </div>
    </section>
  );
}
