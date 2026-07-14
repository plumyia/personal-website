"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { heroData } from "@/lib/data";

const INTRO_TEXT = "我是一名品牌营销从业者，专注内容传播与活动执行。";

export function HeroSection() {
  const [stage, setStage] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // After the reveal-vertical animation finishes (1s), drop the class so
  // clip-path is removed. clip-path creates a compositing boundary that
  // clips child transform:scale() — breaking border-radius on hover.
  const [photoRevealed, setPhotoRevealed] = useState(false);

  useEffect(() => {
    const t0 = setTimeout(() => setStage(0), 150);
    const t1 = setTimeout(() => setStage(1), 1100);
    const t2 = setTimeout(() => setStage(2), 1450);
    const t3 = setTimeout(() => setStage(3), 1800);
    // Remove clip-path after reveal animation completes
    const tr = setTimeout(() => setPhotoRevealed(true), 1150);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tr);
    };
  }, []);


  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pb-10 pt-32 sm:px-8"
    >
      {/* ================================================================
          Background — Gradient Glow
          ================================================================ */}
      <div
        className="hero-glow absolute inset-0 z-0 opacity-0 animate-cinematic-reveal"
        style={{ animationDelay: "0.4s", animationDuration: "2s" }}
        aria-hidden="true"
      />

      {/* ================================================================
          Floating Decorative Elements
          ================================================================ */}
      <div
        className="animate-pulse-dot pointer-events-none absolute left-[20%] top-[10%] z-0 hidden h-5 w-5 rounded-full bg-accent/20 lg:block"
        aria-hidden="true"
      />
      <div
        className="animate-float-ring pointer-events-none absolute right-[18%] top-[18%] z-0 hidden h-4 w-4 rounded-full bg-text-secondary/15 lg:block"
        aria-hidden="true"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="animate-gentle-spin pointer-events-none absolute left-[8%] bottom-[28%] z-0 hidden h-12 w-12 rounded-full border border-accent/25 lg:block"
        aria-hidden="true"
      />
      <div
        className="animate-float-diamond pointer-events-none absolute right-[10%] bottom-[30%] z-0 hidden h-10 w-10 rotate-45 bg-accent/12 lg:block"
        aria-hidden="true"
        style={{ animationDelay: "0.8s" }}
      />
      <div
        className="animate-drift-triangle pointer-events-none absolute left-[30%] bottom-[42%] z-0 hidden h-3.5 w-3.5 bg-text-tertiary/20 lg:block"
        aria-hidden="true"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="animate-float-ring pointer-events-none absolute right-[22%] top-[28%] z-0 hidden lg:block"
        aria-hidden="true"
        style={{ animationDelay: "3s" }}
      >
        <svg
          width="24"
          height="21"
          viewBox="0 0 24 21"
          fill="none"
          className="text-accent/20"
        >
          <path
            d="M12 0L24 21H0L12 0Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* ================================================================
          Two-Column Layout: Photo (left) + Intro & Taglines (right)
          ================================================================ */}
      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-6 lg:flex-row lg:items-center lg:gap-8">
        {/* Left — Life Photo (vertical reveal) */}
        <div className="w-full lg:w-[40%] flex justify-center lg:justify-start lg:pl-16">
          <div
            className={`max-w-[300px] w-full overflow-visible ${
              photoRevealed
                ? ""
                : stage >= 0
                  ? "animate-reveal-vertical"
                  : "opacity-0"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src="/avatar/life-photo.jpg"
              alt="徐羽佳"
              className="w-full cursor-hover rounded-xl object-cover"
              loading="eager"
              whileHover={{
                scale: 1.02,
                y: -4,
                boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{ borderRadius: "0.75rem" }}
            />
          </div>
        </div>

        {/* Right — Self-intro + Taglines */}
        <div className="flex w-full flex-col items-start text-left lg:w-[60%]">
          {/* Self-intro — per-char hover with neighbor effect */}
          <h1 className="font-display text-[clamp(28px,3.5vw,44px)] font-semibold leading-[1.5] text-text-primary">
            <span
              className={`inline-block ${stage >= 0 ? "animate-cinematic-reveal" : "opacity-0"}`}
            >
              {[...INTRO_TEXT].map((char, i) => {
                const isActive =
                  hoveredIndex !== null && Math.abs(i - hoveredIndex) <= 1;
                return (
                  <span
                    key={i}
                    className={`hero-char inline-block cursor-hover ${isActive ? "text-accent" : ""}`}
                    style={{
                      transform: isActive
                        ? `translateY(${i % 2 === 0 ? -6 : -3}px) scale(1.04)`
                        : "translateY(0) scale(1)",
                    }}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {char === " " ? " " : char}
                  </span>
                );
              })}
            </span>
          </h1>

          {/* Taglines — alternating slide-in, bilingual, with icons */}
          <div className="mt-8 flex flex-col items-start gap-4">
            {heroData.taglines.map((line, i) => (
              <div
                key={line.en}
                className={`flex items-center gap-3 ${stage > i ? "" : "opacity-0"} ${
                  stage > i
                    ? i % 2 === 0
                      ? "animate-slide-left"
                      : "animate-slide-right"
                    : ""
                }`}
                style={{
                  animationDelay: stage > i ? `${0.1 + i * 0.08}s` : "0s",
                }}
              >
                {/* Icon image — same container width for text alignment, 商场酒店 overflows */}
                <div className="h-12 w-12 shrink-0 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/${line.zh}.webp`}
                    alt={line.zh}
                    className={`object-contain ${line.zh === "商场酒店" ? "h-14 w-14 max-w-none" : line.zh === "时尚生活" ? "h-[3.25rem] w-[3.25rem] max-w-none" : "max-h-full max-w-full"}`}
                  />
                </div>
                {/* Text */}
                <div className="flex flex-col items-start">
                  <span className="font-display text-[clamp(17px,2.5vw,24px)] font-medium tracking-wide text-text-secondary">
                    {line.zh}
                  </span>
                  <span className="mt-0.5 text-[13px] tracking-widest text-text-tertiary uppercase">
                    {line.en}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
