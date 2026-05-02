import { ChevronDown, FileText } from "lucide-react";
import { schoolInfo } from "@/data/school-info";
import { IconBadge } from "./IconBadge";
import { SectionHeader } from "./SectionHeader";

export function PoliciesSection() {
  return (
    <section id="policies" className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="السياسات"
          title="السياسات ذات الصلة بالطلبة وأولياء الأمور"
          description="توضح هذه السياسات القواعد الأساسية المنظمة للعلاقة بين الروضة وولي الأمر بما يدعم مصلحة الطفل وانتظامه."
          align="center"
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {schoolInfo.policies.map((policy, index) => (
            <details
              key={policy.id}
              open={index === 0}
              className="group overflow-hidden rounded-[2rem] border border-brand-line bg-brand-ivory/90 p-5 shadow-[0_18px_52px_rgba(16,64,45,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(16,64,45,0.11)]"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <span className="flex gap-4">
                  <IconBadge icon={FileText} size="sm" tone="beige" />
                  <span>
                    <span className="block text-xl font-extrabold text-brand-deep">
                      {policy.title}
                    </span>
                    <span className="mt-2 block text-sm leading-7 text-brand-calm">
                      {policy.summary}
                    </span>
                  </span>
                </span>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-brand-deep transition group-open:rotate-180">
                  <ChevronDown className="size-5" aria-hidden="true" />
                </span>
              </summary>
              <ul className="mt-5 space-y-3 border-t border-brand-line pt-5 text-brand-calm">
                {policy.items.map((item) => (
                  <li key={item} className="flex gap-3 leading-8">
                    <span
                      aria-hidden="true"
                      className="mt-3 size-2 shrink-0 rounded-full bg-brand-warm"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
