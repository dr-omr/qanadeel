import { ArrowLeft, Camera, Images, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  featuredGalleryImages,
  galleryImages,
  type GalleryImage,
} from "@/data/school-gallery";

const categoryLabels: Record<string, string> = {
  events: "فعاليات",
  classrooms: "صفوف",
  activities: "أنشطة",
  play: "لعب",
  facilities: "مرافق",
  staff: "فريق",
  exterior: "الواجهة",
};

const accentClasses = [
  "bg-brand-deep text-white",
  "bg-brand-warm text-brand-deep",
  "bg-emerald-100 text-emerald-900",
  "bg-sky-100 text-sky-900",
  "bg-rose-100 text-rose-900",
  "bg-amber-100 text-amber-900",
];

function GalleryTile({
  image,
  index,
  featured = false,
}: {
  image: GalleryImage;
  index: number;
  featured?: boolean;
}) {
  return (
    <Link
      href="/gallery"
      className={`group relative block overflow-hidden rounded-[1.75rem] border border-white/70 bg-brand-paper shadow-[0_18px_46px_rgba(16,64,45,0.10)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(16,64,45,0.16)] ${
        featured ? "aspect-[4/3] min-h-[360px] lg:min-h-[520px]" : "aspect-[4/3]"
      }`}
      aria-label={`عرض صورة: ${image.title}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={
          featured
            ? "(max-width: 1024px) 100vw, 54vw"
            : "(max-width: 768px) 100vw, 24vw"
        }
        className="object-cover transition duration-700 group-hover:scale-[1.055]"
        priority={index < 2}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/16 to-transparent" />
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-extrabold shadow-sm backdrop-blur ${
            accentClasses[index % accentClasses.length]
          }`}
        >
          {categoryLabels[image.category] ?? "الروضة"}
        </span>
        {image.featured ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/88 px-3 py-1 text-xs font-extrabold text-brand-deep shadow-sm backdrop-blur">
            <Sparkles className="size-3.5" aria-hidden="true" />
            مميزة
          </span>
        ) : null}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className={featured ? "text-xl font-extrabold text-white" : "text-sm font-extrabold text-white"}>
          {image.title}
        </h3>
        {image.description ? (
          <p className="mt-1 line-clamp-2 text-sm leading-7 text-white/78">
            {image.description}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

export function GalleryPreviewSection() {
  const images = featuredGalleryImages.slice(0, 7);
  const primaryImage = images[0];
  const secondaryImages = images.slice(1, 7);

  if (!primaryImage) return null;

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-line bg-brand-ivory px-4 py-2 text-xs font-extrabold text-brand-deep shadow-sm">
              <Camera className="size-4" aria-hidden="true" />
              استوديو قناديل العلم
            </span>
            <h2 className="mt-4 max-w-2xl text-[clamp(1.75rem,4vw,3.15rem)] font-extrabold leading-[1.25] text-brand-deep">
              صور حقيقية من يوم أطفالنا داخل الروضة
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-brand-calm">
              لمحات دافئة من الصفوف والاحتفالات والأنشطة اليومية، تعطي ولي الأمر صورة قريبة وواضحة عن بيئة قناديل العلم.
            </p>

            <div className="mt-7 grid max-w-lg grid-cols-2 gap-3">
              <div className="rounded-2xl border border-brand-line bg-brand-ivory p-4">
                <p className="text-2xl font-extrabold text-brand-deep">
                  {galleryImages.length}+
                </p>
                <p className="mt-1 text-xs font-bold text-brand-calm">صورة موثقة</p>
              </div>
              <div className="rounded-2xl border border-brand-line bg-white p-4 shadow-sm">
                <p className="text-2xl font-extrabold text-brand-deep">
                  {featuredGalleryImages.length}
                </p>
                <p className="mt-1 text-xs font-bold text-brand-calm">لقطة مميزة</p>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/gallery"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-deep px-6 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#11382d]"
              >
                <Images className="size-4" aria-hidden="true" />
                فتح المعرض الكامل
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <GalleryTile image={primaryImage} index={0} featured />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {secondaryImages.map((image, index) => (
            <GalleryTile key={image.id} image={image} index={index + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
