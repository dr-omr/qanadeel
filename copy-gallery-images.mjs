/**
 * ═══════════════════════════════════════════════════════════════════
 * سكربت نقل صور المعرض إلى مجلدات المشروع
 * ═══════════════════════════════════════════════════════════════════
 *
 * الاستخدام:
 *   node copy-gallery-images.mjs
 *
 * قبل التشغيل:
 *   1. ضع صور الفعاليات في مجلد temp-gallery/ في جذر المشروع
 *   2. سمّ الملفات حسب الأسماء المطلوبة (انظر أدناه)
 *   3. شغّل هذا السكربت
 *
 * ═══════════════════════════════════════════════════════════════════
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";

const SOURCE_DIR = "temp-gallery";
const DEST_BASE = join("public", "images", "school-gallery");

// ─── الدفعة الأولى (5 صور) ───
// national-day-performance-01.jpg → events
// national-day-art-01.jpg → events
// national-day-celebration-01.jpg → events
// birthday-celebration-01.jpg → events
// national-day-group-01.jpg → events
//
// ─── الدفعة الثانية (5 صور) ───
// national-day-art-02.jpg → events
// national-day-boys-01.jpg → events
// graduation-ceremony-01.jpg → events
// ramadan-haq-allaila-01.jpg → events
// national-day-family-01.jpg → events

const imageMapping = {
  // Batch 1
  "national-day-performance-01.jpg": "events",
  "national-day-art-01.jpg": "events",
  "national-day-celebration-01.jpg": "events",
  "birthday-celebration-01.jpg": "events",
  "national-day-group-01.jpg": "events",
  // Batch 2
  "national-day-art-02.jpg": "events",
  "national-day-boys-01.jpg": "events",
  "graduation-ceremony-01.jpg": "events",
  "ramadan-haq-allaila-01.jpg": "events",
  "national-day-family-01.jpg": "events",
};

// Ensure destination dirs exist
const categories = [...new Set(Object.values(imageMapping))];
for (const cat of categories) {
  const dir = join(DEST_BASE, cat);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

// Check source directory
if (!existsSync(SOURCE_DIR)) {
  console.log(`\n⚠️  مجلد ${SOURCE_DIR} غير موجود.`);
  console.log(`   أنشئ المجلد وضع الصور فيه ثم أعد تشغيل هذا السكربت.\n`);
  console.log("   الصور المطلوبة:");
  for (const name of Object.keys(imageMapping)) {
    console.log(`     - ${name}`);
  }
  process.exit(1);
}

const files = readdirSync(SOURCE_DIR);
let copied = 0;

for (const [filename, category] of Object.entries(imageMapping)) {
  const src = join(SOURCE_DIR, filename);
  const dest = join(DEST_BASE, category, filename);

  if (existsSync(src)) {
    copyFileSync(src, dest);
    console.log(`✅ ${filename} → ${category}/`);
    copied++;
  } else {
    console.log(`❌ لم يتم العثور على: ${filename}`);
  }
}

console.log(`\n📸 تم نسخ ${copied} من ${Object.keys(imageMapping).length} صورة.`);
if (copied > 0) {
  console.log("🎉 الصور جاهزة للاستخدام في الموقع!\n");
}
