import Image from "next/image";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { schoolInfo } from "@/data/school-info";

export function Footer() {
  return (
    <footer className="bg-brand-deep px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="inline-flex rounded-3xl bg-white p-3 shadow-[0_18px_46px_rgba(0,0,0,0.14)]">
            <Image
              src={schoolInfo.logoPath}
              alt={schoolInfo.officialName}
              width={360}
              height={138}
              className="h-auto w-64 object-contain"
            />
          </div>
          <h2 className="mt-5 text-xl font-extrabold">
            {schoolInfo.officialName}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-[#f8f0df]">
            {schoolInfo.disclosureText}
          </p>
        </div>

        <div>
          <h3 className="text-base font-extrabold text-[#f5e8cf]">
            روابط سريعة
          </h3>
          <div className="mt-4 grid gap-3 text-sm font-bold text-white/85">
            {schoolInfo.navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition hover:text-brand-warm"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base font-extrabold text-[#f5e8cf]">
            بيانات التواصل
          </h3>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/85">
            <a
              href={`tel:${schoolInfo.phone}`}
              className="flex items-center gap-2 transition hover:text-brand-warm"
            >
              <Phone className="size-4" aria-hidden="true" />
              {schoolInfo.phone}
            </a>
            <a
              href={`https://wa.me/${schoolInfo.whatsappInternational}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition hover:text-brand-warm"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              {schoolInfo.whatsapp}
            </a>
            <a
              href={`mailto:${schoolInfo.email}`}
              className="flex items-center gap-2 transition hover:text-brand-warm"
            >
              <Mail className="size-4" aria-hidden="true" />
              {schoolInfo.email}
            </a>
            <p>{schoolInfo.workingHours}</p>
            <a
              href={schoolInfo.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition hover:text-brand-warm"
            >
              <MapPin className="size-4" aria-hidden="true" />
              {schoolInfo.address}
            </a>
            <p>{schoolInfo.country}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
