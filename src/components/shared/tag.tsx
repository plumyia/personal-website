interface TagProps {
  children: React.ReactNode;
  variant?: "default" | "outline";
}

export function Tag({ children, variant = "default" }: TagProps) {
  return (
    <span
      className={`inline-block rounded-full px-4 py-2 text-[13px] leading-none transition-colors ${
        variant === "outline"
          ? "border border-border text-text-secondary"
          : "bg-bg-tertiary text-text-secondary"
      }`}
    >
      {children}
    </span>
  );
}
