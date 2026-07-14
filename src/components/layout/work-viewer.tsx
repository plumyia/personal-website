"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/lib/data";
import { useRouter } from "next/navigation";

export function WorkViewer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionKey, setTransitionKey] = useState(0);

  const router = useRouter();
  const total = projects.length;

  const loopIndex = (i: number) => ((i % total) + total) % total;
  const prevIndex = loopIndex(currentIndex - 1);
  const nextIndex = loopIndex(currentIndex + 1);

  const current = projects[currentIndex];
  const prev = projects[prevIndex];
  const next = projects[nextIndex];

  const goNext = useCallback(() => {
    setTransitionKey((k) => k + 1);
    setCurrentIndex((i) => loopIndex(i + 1));
  }, []);

  const goPrev = useCallback(() => {
    setTransitionKey((k) => k + 1);
    setCurrentIndex((i) => loopIndex(i - 1));
  }, []);

  const goTo = useCallback((idx: number) => {
    setTransitionKey((k) => k + 1);
    setCurrentIndex(idx);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  // Center-expand
  const scaleVariants = {
    enter: { opacity: 0, scale: 0.82 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.92 },
  };
  const scaleTransition = {
    opacity: { duration: 0.28, ease: "easeOut" as const },
    scale: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  };

  return (
    <>
      {/* ================================================================
          3×3 Grid: cols 1:2:1, rows 1:1:1

          Row 1:  [empty]  [TITLE]   [empty]
          Row 2:  [PREV]   [CENTER]  [NEXT]
          Row 3:  [empty]  [TAGS + CONTROLS]  [empty]
          ================================================================ */}
      <div
        className="grid w-full px-4 sm:px-8"
        style={{
          gridTemplateColumns: "1fr 2fr 1fr",
          gridTemplateRows: "1fr 1fr 0.8fr",
          height: "calc(100vh - 4rem - 3vh)",
        }}
      >
        {/* ---- Row 1, Col 2: Project Title (bottom-aligned) ---- */}
        <motion.h2
          key={`title-${current.slug}-${transitionKey}`}
          className="col-start-2 row-start-1 flex items-end justify-center pb-2 font-display text-[clamp(14px,2vw,20px)] font-semibold leading-tight tracking-wide text-text-primary"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {current.name}
        </motion.h2>

        {/* ---- Row 2, Col 1: PREV ---- */}
        <button
          onClick={goPrev}
          className="col-start-1 row-start-2 group flex flex-col items-end justify-center pr-3"
        >
          <div className="w-[95%] overflow-hidden rounded-xl opacity-55 transition-all duration-400 group-hover:opacity-80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={prev.cover}
              alt={prev.name}
              className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <p className="mt-1.5 w-full text-center text-[11px] tracking-wider text-text-tertiary/50">
            {prev.name}
          </p>
        </button>

        {/* ---- Row 2, Col 2: CENTER ---- */}
        <div className="col-start-2 row-start-2 flex items-center justify-center px-3 py-2">
          <AnimatePresence mode="wait">
            <motion.button
              key={`${current.slug}-${transitionKey}`}
              variants={scaleVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={scaleTransition}
              className="relative flex h-full w-[92%] items-center justify-center overflow-hidden rounded-xl shadow-lg ring-1 ring-border/60"
              onClick={() => {
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
                router.push(`/projects/${current.slug}`);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.cover}
                alt={current.name}
                className="aspect-[3/2] w-full object-contain"
              />
            </motion.button>
          </AnimatePresence>
        </div>

        {/* ---- Row 2, Col 3: NEXT ---- */}
        <button
          onClick={goNext}
          className="col-start-3 row-start-2 group flex flex-col items-start justify-center pl-3"
        >
          <div className="w-[95%] overflow-hidden rounded-xl opacity-55 transition-all duration-400 group-hover:opacity-80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={next.cover}
              alt={next.name}
              className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <p className="mt-1.5 w-full text-center text-[11px] tracking-wider text-text-tertiary/50">
            {next.name}
          </p>
        </button>

        {/* ---- Row 3, Col 2: Tags + Controls ---- */}
        <div className="col-start-2 row-start-3 flex flex-col items-center justify-start pt-2">
          {/* Tags */}
          <motion.div
            key={`tags-${current.slug}-${transitionKey}`}
            className="flex flex-wrap justify-center gap-2"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.06, ease: "easeOut" }}
          >
            {current.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-bg-secondary/60 px-3 py-1 text-[12px] text-text-tertiary"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Controls */}
          <div className="mt-5 flex items-center gap-8">
            <button
              onClick={goPrev}
              className="text-2xl text-text-tertiary/40 transition-colors hover:text-accent"
            >
              &#8249;
            </button>

            <div className="flex items-center gap-2.5">
              {projects.map((p, i) => (
                <button
                  key={p.slug}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? "h-2 w-6 bg-accent"
                      : "h-2 w-2 bg-border hover:bg-accent/40"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={goNext}
              className="text-2xl text-text-tertiary/40 transition-colors hover:text-accent"
            >
              &#8250;
            </button>
          </div>

          <p className="mt-2 text-[11px] tracking-[0.2em] text-text-tertiary/50">
            {currentIndex + 1}{" "}
            <span className="text-text-tertiary/25">/</span> {total}
          </p>
        </div>
      </div>
    </>
  );
}
