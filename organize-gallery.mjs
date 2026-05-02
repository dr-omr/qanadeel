/**
 * سكربت تنظيم وإعادة تسمية صور المعرض
 * يقرأ الصور من مجلد events ويوزعها على المجلدات الصحيحة
 * 
 * التشغيل: node organize-gallery.mjs
 */

import { copyFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const BASE = join("public", "images", "school-gallery");

// Ensure directories exist
for (const dir of ["events", "classrooms", "facilities"]) {
  const p = join(BASE, dir);
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

const SRC = join(BASE, "events");

const mapping = [
  // ─── العيد الوطني (National Day) → events ───
  { from: "WhatsApp Image 2026-05-02 at 1.36.06 PM.jpeg",       to: join(BASE, "events", "national-day-performance-01.jpeg"),   label: "عرض بنات - العيد الوطني" },
  { from: "WhatsApp Image 2026-05-02 at 1.36.06 PM.jpeg1.jpeg",  to: join(BASE, "events", "national-day-art-01.jpeg"),            label: "طفلة بجانب لوحة فنية" },
  { from: "WhatsApp Image 2026-05-02 at 1.36.07 PM.jpeg4.jpeg",  to: join(BASE, "events", "national-day-celebration-01.jpeg"),    label: "بنات يحتفلن بالعيد الوطني" },
  { from: "WhatsApp Image 2026-05-02 at 1.36.07 PM.jpeg5.jpeg",  to: join(BASE, "events", "national-day-celebration-02.jpeg"),    label: "بنات من الخلف - العيد الوطني" },
  { from: "WhatsApp Image 2026-05-02 at 1.36.07 PM.jpeg6.jpeg",  to: join(BASE, "events", "national-day-boys-01.jpeg"),           label: "أولاد بزي رسمي - العيد الوطني" },
  { from: "WhatsApp Image 2026-05-02 at 1.36.08 PM.jpeg7.jpeg",  to: join(BASE, "events", "national-day-family-01.jpeg"),         label: "صورة عائلية - العيد الوطني" },
  { from: "WhatsApp Image 2026-05-02 at 1.36.09 PM.jpeg0.jpeg",  to: join(BASE, "events", "national-day-art-02.jpeg"),            label: "طفلة تشير للوحة فنية" },
  { from: "WhatsApp Image 2026-05-02 at 1.36.11 PM.jpeg19.jpeg", to: join(BASE, "events", "national-day-dance-01.jpeg"),          label: "عرض راقص - العيد الوطني" },

  // ─── حفل التخرج (Graduation) → events ───
  { from: "WhatsApp Image 2026-05-02 at 1.36.08 PM.jpeg8.jpeg",  to: join(BASE, "events", "graduation-ceremony-01.jpeg"),        label: "تخرج - فستان أزرق" },
  { from: "WhatsApp Image 2026-05-02 at 1.36.09 PM.jpeg12.jpeg", to: join(BASE, "events", "graduation-ceremony-02.jpeg"),        label: "تخرج - فستان أزرق 2" },
  { from: "WhatsApp Image 2026-05-02 at 1.36.11 PM.jpeg17.jpeg", to: join(BASE, "events", "graduation-ceremony-03.jpeg"),        label: "تخرج - فستان كستنائي مع شهادة" },
  { from: "WhatsApp Image 2026-05-02 at 1.36.11 PM.jpeg18.jpeg", to: join(BASE, "events", "graduation-ceremony-04.jpeg"),        label: "تخرج - فستان كستنائي" },

  // ─── رمضان وحق الليلة (Ramadan) → events ───
  { from: "WhatsApp Image 2026-05-02 at 1.36.08 PM.jpeg9.jpeg",  to: join(BASE, "events", "ramadan-haq-allaila-01.jpeg"),        label: "طفل حق الليلة" },
  { from: "WhatsApp Image 2026-05-02 at 1.36.09 PM.jpeg11.jpeg", to: join(BASE, "events", "ramadan-haq-allaila-02.jpeg"),        label: "طفلة زي تقليدي - رمضان" },
  { from: "WhatsApp Image 2026-05-02 at 1.36.10 PM.jpeg15.jpeg", to: join(BASE, "events", "ramadan-decoration-01.jpeg"),         label: "ديكور رمضاني" },
  { from: "WhatsApp Image 2026-05-02 at 1.36.10 PM.jpeg16.jpeg", to: join(BASE, "events", "ramadan-haq-allaila-03.jpeg"),        label: "طفلة حق الليلة" },
  { from: "WhatsApp Image 2026-05-02 at 1.36.12 PM.jpeg20.jpeg", to: join(BASE, "events", "ramadan-haq-allaila-04.jpeg"),        label: "طفل زي تقليدي - رمضان" },

  // ─── حفلة عيد ميلاد (Birthday) → events ───
  { from: "WhatsApp Image 2026-05-02 at 1.36.06 PM.jpeg32.jpeg", to: join(BASE, "events", "birthday-celebration-01.jpeg"),       label: "ديكور حفلة عيد ميلاد" },

  // ─── صور الصفوف / رمضان جماعي (Classrooms) → classrooms ───
  { from: "WhatsApp Image 2026-05-02 at 1.36.09 PM.jpeg13.jpeg", to: join(BASE, "classrooms", "ramadan-class-group-01.jpeg"),    label: "صورة جماعية - رمضان (مع رسم)" },
  { from: "WhatsApp Image 2026-05-02 at 1.36.10 PM.jpeg14.jpeg", to: join(BASE, "classrooms", "ramadan-class-group-02.jpeg"),    label: "صورة جماعية - رمضان (مع رسم)" },
  { from: "WhatsApp Image 2026-05-02 at 1.45.16 PM.jpeg24.jpeg", to: join(BASE, "classrooms", "first-day-girls-01.jpeg"),        label: "أول يوم - بنات مع ورود" },
  { from: "WhatsApp Image 2026-05-02 at 1.45.16 PM.jpeg25.jpeg", to: join(BASE, "classrooms", "first-day-girls-02.jpeg"),        label: "أول يوم - بنات صغيرات" },
  { from: "WhatsApp Image 2026-05-02 at 1.45.17 PM.jpeg26.jpeg", to: join(BASE, "classrooms", "first-day-boy-01.jpeg"),          label: "أول يوم - ولد مع باص" },
  { from: "WhatsApp Image 2026-05-02 at 1.45.17 PM.jpeg27.jpeg", to: join(BASE, "classrooms", "first-day-girl-01.jpeg"),         label: "أول يوم - بنت" },
  { from: "WhatsApp Image 2026-05-02 at 1.45.17 PM.jpeg28.jpeg", to: join(BASE, "classrooms", "first-day-girl-02.jpeg"),         label: "أول يوم - بنت مع باص" },
  { from: "WhatsApp Image 2026-05-02 at 1.45.18 PM.jpeg29.jpeg", to: join(BASE, "classrooms", "first-day-boys-01.jpeg"),         label: "أول يوم - أولاد مع ألواح" },
  { from: "WhatsApp Image 2026-05-02 at 1.45.18 PM.jpeg30.jpeg", to: join(BASE, "classrooms", "first-day-girl-03.jpeg"),         label: "أول يوم - بنت مع باص" },

  // ─── المرافق (Facilities) ───
  { from: "WhatsApp Image 2026-05-02 at 1.45.15 PM.jpeg23.jpeg", to: join(BASE, "facilities", "facility-courtyard-01.jpeg"),    label: "ساحة الروضة الداخلية" },
];

let success = 0;
let fail = 0;

for (const { from, to, label } of mapping) {
  const src = join(SRC, from);
  if (existsSync(src)) {
    copyFileSync(src, to);
    console.log(`✅ ${label} → ${to.replace(BASE + "\\", "").replace(BASE + "/", "")}`);
    success++;
  } else {
    console.log(`❌ لم يتم العثور على: ${from}`);
    fail++;
  }
}

console.log(`\n📸 تم نسخ ${success} صورة بنجاح (${fail} لم تُعثر).`);
console.log("🎉 الصور موزعة الآن حسب التصنيف!\n");
