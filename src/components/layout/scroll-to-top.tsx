"use client";

export function ScrollToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="text-[12px] text-text-tertiary transition-colors hover:text-accent cursor-hover"
    >
      回到顶部 &uarr;
    </button>
  );
}
