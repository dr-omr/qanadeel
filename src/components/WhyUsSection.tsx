import { ClipboardCheck, HeartHandshake, MessagesSquare } from "lucide-react";
import { schoolInfo } from "@/data/school-info";
import { IconBadge, PremiumCard } from "./PremiumCard";
import { SectionHeader } from "./SectionHeader";

const featureIcons = [ClipboardCheck, HeartHandshake, MessagesSquare];

export function WhyUsSection() {
  return (
    <section className="bg-brand-ivory px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="مميزاتنا"
          title="ما الذي يميز تجربة ولي الأمر؟"
          description="تم تصميم المعلومات والخدمات الأساسية لتكون واضحة، رسمية، وسهلة الوصول من الجوال وسطح المكتب."
          align="center"
        />
        <div className="grid gap-5 md:grid-cols-3">
          {schoolInfo.features.map((feature, index) => {
            const Icon = featureIcons[index] ?? ClipboardCheck;

            return (
              <PremiumCard key={feature.label} className="p-6">
                <IconBadge>
                  <Icon className="size-6" aria-hidden="true" />
                </IconBadge>
                <h3 className="mt-5 text-xl font-extrabold text-brand-deep">
                  {feature.label}
                </h3>
                <p className="mt-3 leading-8 text-brand-calm">
                  {feature.description}
                </p>
              </PremiumCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
