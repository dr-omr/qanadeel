import { BadgeCheck, DoorOpen, GraduationCap, Receipt } from "lucide-react";
import { schoolInfo } from "@/data/school-info";
import { PremiumCard } from "./PremiumCard";

const statIcons = [DoorOpen, GraduationCap, Receipt, BadgeCheck];

export function StatsSection() {
  return (
    <section className="bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {schoolInfo.stats.map((stat, index) => {
          const Icon = statIcons[index] ?? BadgeCheck;

          return (
            <PremiumCard
              key={stat.label}
              className="flex min-h-44 items-start gap-4 p-5"
              variant="compact"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-deep/10 text-brand-deep">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-3xl font-extrabold text-brand-deep">
                  {stat.value}
                </p>
                <h3 className="mt-2 text-lg font-extrabold text-brand-deep">
                  {stat.label}
                </h3>
                <p className="mt-2 leading-7 text-brand-calm">
                  {stat.description}
                </p>
              </div>
            </PremiumCard>
          );
        })}
      </div>
    </section>
  );
}
