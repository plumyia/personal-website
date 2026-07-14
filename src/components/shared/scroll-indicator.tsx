"use client";

import { useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  targetId: string;
  /** Hover fill background color — matches project's content gradient start */
  hoverBg?: string;
  /** Optional: override auto-computed hover text color */
  hoverText?: string;
}

/* ---- JS-driven smooth scroll — main-thread rAF, not compositor ----
   scrollIntoView({ behavior: "smooth" }) runs on the compositor thread
   and only moves already-rasterized tiles. Off-screen content that hasn't
   been rasterized yet shows as black until the animation ends and the main
   thread paints. Using rAF-driven scrollTo forces the main thread to paint
   every frame, so newly-visible content is always ready. */
function smoothScrollTo(target: HTMLElement) {
  const startY = window.scrollY;
  const targetY = target.getBoundingClientRect().top + startY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 4) return; // already there

  const duration = 600; // ms
  let raf: number;

  function step(now: number) {
    const elapsed = now - t0;
    const t = Math.min(elapsed / duration, 1);
    // easeInOutCubic
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    window.scrollTo({ top: startY + distance * eased, behavior: "instant" as ScrollBehavior });
    if (t < 1) {
      raf = requestAnimationFrame(step);
    }
  }

  const t0 = performance.now();
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

/** Compute perceived luminance 0-1. >0.65 → use dark text, else white. */
function getLuminance(hex: string): number {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function ScrollIndicator({ targetId, hoverBg, hoverText }: Props) {
  const animRef = useRef<(() => void) | undefined>(undefined);
  const [hovered, setHovered] = useState(false);
  const hasFill = hoverBg !== undefined;
  const hoverBorder = hasFill ? hoverBg! : "#fefaf3";
  const textColor = hasFill
    ? (hoverText ?? (getLuminance(hoverBg!) > 0.65 ? "#2d1a10" : "#fefaf3"))
    : "#fefaf3";

  const handleClick = useCallback(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    animRef.current?.();
    animRef.current = smoothScrollTo(target);
  }, [targetId]);

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
    >
      <div
        className="relative flex items-center gap-3 rounded-full border-2 px-6 py-3 backdrop-blur-sm transition-all duration-300"
        style={{
          borderColor: hovered ? hoverBorder : "rgba(255,255,255,0.35)",
          background: hovered && hasFill ? hoverBg : "transparent",
          color: hovered ? textColor : "rgba(255,255,255,0.7)",
        }}
      >
        <span className="relative text-[12px] tracking-[0.25em] uppercase">
          Scroll
        </span>

        <motion.svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative"
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </motion.svg>
      </div>
    </button>
  );
}
