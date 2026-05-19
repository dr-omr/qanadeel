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
    <div className={`mb-9 max-w-3xl ${alignment} ${className}`}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-extrabold text-brand-calm">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-[clamp(1.75rem,4vw,2.6rem)] font-extrabold leading-[1.35] text-brand-deep">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-8 text-brand-calm sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
