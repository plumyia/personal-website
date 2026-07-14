"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { brandLogos } from "@/lib/data";
import type { BrandLogo } from "@/lib/types";

/* ================================================================
   Brand Lightbox — phone frame + scrollable detail image
   ================================================================ */

function BrandLightbox({
  brand,
  onClose,
  onPrev,
  onNext,
  index,
  total,
}: {
  brand: BrandLogo;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  index: number;
  total: number;
}) {
  const screenRef = useRef<HTMLDivElement>(null);
  const mainImgRef = useRef<HTMLImageElement>(null);
  const phoneControls = useAnimationControls();

  // Sync detail0 visibility with main image load — avoids flash of
  // old detail image without its detail0 companion during transition.
  const [showDetail0, setShowDetail0] = useState(brand.hasDetail0);

  useEffect(() => {
    const img = mainImgRef.current;
    if (!img) return;
    // Reset scroll
    if (screenRef.current) screenRef.current.scrollTop = 0;
    // Scale pop
    phoneControls.start({
      scale: [1, 1.025, 1],
      transition: { duration: 0.28, times: [0, 0.35, 1], ease: "easeOut" },
    });

    const sync = () => setShowDetail0(brand.hasDetail0);

    // currentSrc reflects the image actually rendered. If it already
    // matches the new brand (pre-decoded → instant), sync now.
    // encodeURIComponent handles slugs with spaces (e.g. "common rare").
    if (img.currentSrc.includes(encodeURIComponent(brand.slug))) {
      sync();
    } else {
      img.addEventListener("load", sync, { once: true });
      return () => img.removeEventListener("load", sync);
    }
  }, [brand.slug, brand.hasDetail0, phoneControls]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      {/* Top bar */}
      <button
        className="absolute right-6 top-6 text-sm tracking-[0.2em] text-white/50 uppercase transition-colors hover:text-white z-10"
        onClick={onClose}
      >
        Close <span className="ml-1">&times;</span>
      </button>
      <span className="absolute left-6 top-6 text-sm tracking-wider text-white/50 z-10">
        {(index + 1).toString().padStart(2, "0")} /{" "}
        {total.toString().padStart(2, "0")}
      </span>

      {/* Left arrow */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 px-4 py-12 text-3xl text-white/40 transition-colors hover:text-white z-10"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >
        &#8249;
      </button>

      {/* Center: phone + scroll hint */}
      <div
        className="flex items-center gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Phone frame */}
        <div className="relative flex flex-col items-center">
          {/* Brand name */}
          <div className="mb-5 text-center">
            <p className="font-display text-[clamp(14px,2.2vw,18px)] font-semibold tracking-tight text-white/85">
              {brand.name}
            </p>
            {brand.subtitle && (
              <p className="mt-0.5 font-display text-[clamp(14px,2.2vw,18px)] font-semibold tracking-tight text-white/50">
                {brand.subtitle}
              </p>
            )}
          </div>

          {/* Phone body — single DOM, src swap only */}
          <div
            className="select-none"
            style={{
              width: "min(230px, 62vw)",
              filter:
                "drop-shadow(0 24px 60px rgba(0,0,0,0.5)) drop-shadow(0 0 0 1px rgba(240,192,96,0.15))",
            }}
          >
            <motion.div
              className="relative"
              style={{ willChange: "transform" }}
              animate={phoneControls}
            >
              {/* Screen content — single DOM, no remount */}
              <div
                ref={screenRef}
                className="absolute overflow-y-auto scrollbar-hide"
                style={{
                  top: "3.3%",
                  left: "6.1%",
                  right: "6.1%",
                  bottom: "2.9%",
                  borderRadius: "10% / 5%",
                  backgroundColor: "#1a1a1a",
                }}
              >
                {/* detail0 slot — visibility synced with main image load */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    brand.hasDetail0
                      ? `/brands/detail/${brand.slug}-detail0.jpg?v=3`
                      : `/brands/detail/${brand.slug}-detail.jpg?v=3`
                  }
                  alt=""
                  className={showDetail0 ? "block w-full" : "hidden"}
                  draggable={false}
                  decoding="sync"
                />
                {/* main detail — ref for load-sync; overlap to kill hairline gap */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={mainImgRef}
                  src={`/brands/detail/${brand.slug}-detail.jpg?v=3`}
                  alt={`${brand.name} 详情`}
                  className={`block w-full ${showDetail0 ? "-mt-px" : ""}`}
                  draggable={false}
                  decoding="sync"
                />
              </div>

              {/* iPhone 16 Pro frame overlay */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brands/iPhone 16pro.png"
                alt=""
                className="relative z-10 block w-full"
                draggable={false}
                style={{ pointerEvents: "none" }}
              />
            </motion.div>
          </div>
        </div>

        {/* Scroll hint — text left, arrow right */}
        <div className="flex items-center gap-1.8">
          {/* Text — vertical, on the LEFT of arrow */}
          <motion.p
            className="text-[11px] tracking-[0.3em] text-white leading-tight -mt-6"
            style={{ writingMode: "vertical-rl" }}
            animate={{
              opacity: [0.1, 0.1, 0.85, 0.85, 0.1, 0.1],
            }}
            transition={{
              duration: 3,
              times: [0, 0.35, 0.42, 0.68, 0.95, 1],
              repeat: Infinity,
              ease: "linear",
            }}
          >
            下滑查看更多
          </motion.p>

          {/* Arrow SVG */}
          <div className="relative" style={{ height: "100px", width: "24px" }}>
            <svg
              width="24"
              height="100"
              viewBox="0 0 24 100"
              fill="none"
              className="absolute inset-0"
            >
              {/* Path: vertical → smooth curve upward at bottom */}
              <path
                d="M 12,0 L 12,70 C 12,84 16,80 22,70"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Glowing dot — visible journey, instant restart */}
              <motion.circle
                r="2.5"
                fill="white"
                style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.6))" }}
                animate={{
                  cx: [
                    12,    // start at top
                    12,    // bottom of vertical
                    15,    // mid-curve
                    22,    // end of curve
                    22,    // STAY
                    12,    // jump to top (hidden)
                    12,
                  ],
                  cy: [
                    0,     // top
                    70,    // bottom of vertical
                    78,    // mid-curve dip
                    70,    // hooked up to end
                    70,    // STAY
                    0,     // jump to top (hidden)
                    0,
                  ],
                  opacity: [
                    1,     // sliding down
                    1,
                    1,     // at end
                    1,     // staying
                    0,     // hide + jump
                    0,     // hidden briefly
                    1,     // restart (matches frame 0)
                  ],
                }}
                transition={{
                  duration: 3,
                  times: [0, 0.25, 0.35, 0.42, 0.68, 0.95, 1],
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Right arrow */}
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-12 text-3xl text-white/40 transition-colors hover:text-white z-10"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
      >
        &#8250;
      </button>
    </motion.div>
  );
}

/* ================================================================
   Main Page
   ================================================================ */

export default function BrandsPage() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const close = useCallback(() => setSelectedIndex(null), []);
  const goPrev = useCallback(
    () =>
      setSelectedIndex((i) =>
        i !== null ? (i - 1 + brandLogos.length) % brandLogos.length : null,
      ),
    [],
  );
  const goNext = useCallback(
    () =>
      setSelectedIndex((i) =>
        i !== null ? (i + 1) % brandLogos.length : null,
      ),
    [],
  );

  // Keyboard nav
  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex, close, goPrev, goNext]);

  // Lock scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = selectedIndex !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  // Preload + pre-decode all brand detail images so src swap is instant
  useEffect(() => {
    brandLogos.forEach(async (brand) => {
      const urls = [`/brands/detail/${brand.slug}-detail.jpg?v=3`];
      if (brand.hasDetail0) urls.push(`/brands/detail/${brand.slug}-detail0.jpg?v=3`);
      for (const url of urls) {
        const img = new window.Image();
        img.src = url;
        if (img.decode) {
          try { await img.decode(); } catch { /* ignore */ }
        }
      }
    });
  }, []);

  return (
    <>
      <div className="mx-auto max-w-5xl px-6 py-15 sm:px-8">
        <h1 className="font-display text-[clamp(28px,4vw,40px)] font-semibold tracking-tight text-text-primary">
          合作品牌
        </h1>
        <p className="mt-2 text-[14px] text-text-tertiary">Brand Partners</p>

        {/* Logo Grid */}
        <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {brandLogos.map((brand, idx) => (
            <button
              key={brand.slug}
              onClick={() => setSelectedIndex(idx)}
              className="group relative flex cursor-hover flex-col items-center justify-center rounded-xl border border-border bg-bg-secondary h-32 transition-all duration-300 hover:border-accent/40 hover:shadow-sm"
              onMouseEnter={() => setHoveredSlug(brand.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
            >
              {/* Logo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/brands/logo/${brand.file}`}
                alt={brand.name}
                className={`${brand.height || "h-12"} w-auto object-contain transition-all duration-300 group-hover:scale-105 ${brand.logoClass || ""}`}
              />

              {/* Hover Preview Popover */}
              {hoveredSlug === brand.slug && (
                <div className="absolute -top-32 left-1/2 z-30 -translate-x-1/2 w-[15rem] rounded-lg border border-border bg-white p-3 shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/brands/preview/${brand.slug}-preview.jpg`}
                    alt={`${brand.name} 预览`}
                    className="w-full h-auto rounded object-contain"
                  />
                  {/* Speech bubble arrow */}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rotate-45 w-3 h-3 bg-white border-b border-r border-border" />
                </div>
              )}
            </button>
          ))}
        </div>

      {/* Brand Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <BrandLightbox
            brand={brandLogos[selectedIndex]}
            index={selectedIndex}
            total={brandLogos.length}
            onClose={close}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </AnimatePresence>
      </div>
    </>
  );
}
