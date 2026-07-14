interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  label,
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={`flex flex-col gap-3 ${
        align === "center" ? "items-center text-center" : "items-start"
      }`}
    >
      {label && (
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          {label}
        </span>
      )}
      <h2 className="font-display text-[clamp(28px,4vw,42px)] font-semibold leading-tight tracking-tight text-text-primary">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-xl text-[15px] leading-relaxed text-text-secondary">
          {subtitle}
        </p>
      )}
    </div>
  );
}
