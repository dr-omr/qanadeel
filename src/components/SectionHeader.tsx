type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "start",
  className = "",
}: SectionHeaderProps) {
  const alignment =
    align === "center" ? "mx-auto text-center" : "text-right";

  return (
    <div className={`mb-7 max-w-3xl sm:mb-9 ${alignment} ${className}`}>
      {eyebrow ? (
        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-calm/8 px-3.5 py-1 text-[0.75rem] font-extrabold text-brand-calm ring-1 ring-brand-calm/15 sm:text-sm">
          <span className="size-1.5 rounded-full bg-brand-calm/60" />
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-[clamp(1.5rem,5vw,2.6rem)] font-extrabold leading-[1.35] text-brand-deep">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-[0.9rem] leading-[1.85] text-brand-calm sm:mt-4 sm:text-base sm:leading-8 lg:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
