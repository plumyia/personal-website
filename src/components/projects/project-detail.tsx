"use client";

import { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useInView,
  animate,
  type Variants,
} from "framer-motion";
import type { ProjectDetail as ProjectDetailType } from "@/lib/types";
import { projects } from "@/lib/data";
import { Tag } from "@/components/shared/tag";
import { ScrollIndicator } from "@/components/shared/scroll-indicator";
import { RouteMap } from "@/components/projects/route-map";
import { CnyHero } from "@/components/projects/cny-hero";
import { PhoneCarousel } from "@/components/projects/phone-carousel";
import { HorizontalScroll } from "@/components/projects/horizontal-scroll";
import { PhoneReview } from "@/components/projects/phone-review";
import Link from "next/link";

/* ================================================================
   Animation Variants
   ================================================================ */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const springItem: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 340, damping: 28, mass: 0.8 },
  },
};

const roleItem: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 26 },
  },
};

// Blur → sharp (videos)
const blurReveal: Variants = {
  hidden: { opacity: 0, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Clip-path unveil (magazine text)
const clipReveal: Variants = {
  hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
  visible: {
    opacity: 1,
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* ================================================================
   Hero Phases
   ================================================================ */
type HeroPhase = "enter" | "blur" | "text";

/* ================================================================
   HoverVideo — play on first hover, continues after
   ================================================================ */

function HoverVideo({
  src,
  className = "",
  preload = "auto",
}: {
  src: string;
  className?: string;
  preload?: "auto" | "metadata" | "none";
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  const handleHover = useCallback(() => {
    if (!hasPlayed && videoRef.current) {
      videoRef.current.play().catch(() => { });
      setHasPlayed(true);
    }
  }, [hasPlayed]);

  return (
    <motion.video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      preload={preload}
      className={className}
      onMouseEnter={handleHover}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    />
  );
}

/* ================================================================
   Gallery Filmstrip + Lightbox
   ================================================================ */

function GalleryFilmstrip({
  images,
  name,
  compact = false,
}: {
  images: string[];
  name: string;
  compact?: boolean;
}) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>(0);
  const positionRef = useRef(0);
  const lastTimeRef = useRef(0);
  const isPausedRef = useRef(false);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });

  const close = useCallback(() => setLightboxIdx(null), []);
  const prev = useCallback(
    () =>
      setLightboxIdx((i) =>
        i !== null ? (i - 1 + images.length) % images.length : null,
      ),
    [images.length],
  );
  const next = useCallback(
    () =>
      setLightboxIdx((i) =>
        i !== null ? (i + 1) % images.length : null,
      ),
    [images.length],
  );

  // Keyboard nav
  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, close, prev, next]);

  // Lock scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIdx]);

  // ---- RAF-driven infinite scroll — delta-time accumulation, seamless wrap ----
  // Only starts when gallery enters viewport, avoids competing with hero animation
  useEffect(() => {
    if (!inView) return;
    const track = trackRef.current;
    if (!track) return;

    const speed = 45; // px per second
    const halfW = track.scrollWidth / 2;

    const tick = (now: number) => {
      const dt = lastTimeRef.current ? (now - lastTimeRef.current) / 1000 : 0;
      lastTimeRef.current = now;

      if (!isPausedRef.current && dt > 0 && dt < 0.5) {
        // dt guard: skip huge gaps (e.g. tab was backgrounded)
        positionRef.current += speed * dt;
        // modulo ensures seamless wrap — no conditional jump at boundary
        track.style.transform = `translate3d(${-(positionRef.current % halfW)}px, 0, 0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [images.length, inView]);

  const handlePause = useCallback(() => {
    isPausedRef.current = true;
    lastTimeRef.current = 0; // reset dt on next resume
  }, []);
  const handleResume = useCallback(() => {
    isPausedRef.current = false;
  }, []);

  const duplicated = [...images, ...images];

  return (
    <>
      <section ref={sectionRef} className={compact ? "pt-12 px-6 sm:px-8" : "mt-16 px-6 sm:px-8"}>
        <h3 className="text-sm tracking-[0.3em] text-accent uppercase">
          Visual System
        </h3>

        <div
          className="filmstrip-wrapper mt-8 overflow-hidden py-1"
          onMouseEnter={handlePause}
          onMouseLeave={handleResume}
        >
          <div
            ref={trackRef}
            className="filmstrip-track flex w-max gap-4"
          >
            {duplicated.map((src, i) => {
              const realIdx = i % images.length;
              return (
                <button
                  key={`${src}-${i}`}
                  className="filmstrip-card group relative shrink-0 cursor-pointer overflow-hidden rounded-xl"
                  style={{ width: "clamp(220px, 32vw, 320px)", aspectRatio: "4/3" }}
                  onClick={() => setLightboxIdx(realIdx)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${name} — ${realIdx + 1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    draggable={false}
                  />

                  <span className="absolute bottom-3 right-3 rounded-full bg-black/30 px-2 py-0.5 text-[11px] font-medium text-white/70">
                    {(realIdx + 1).toString().padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
          >
            <button
              className="absolute right-6 top-6 text-sm tracking-[0.2em] text-white/50 uppercase transition-colors hover:text-white"
              onClick={close}
            >
              Close <span className="ml-1">&times;</span>
            </button>
            <span className="absolute left-6 top-6 text-sm tracking-wider text-white/50">
              {(lightboxIdx + 1).toString().padStart(2, "0")} /{" "}
              {images.length.toString().padStart(2, "0")}
            </span>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 px-4 py-12 text-3xl text-white/40 transition-colors hover:text-white"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              &#8249;
            </button>
            <motion.img
              key={lightboxIdx}
              src={images[lightboxIdx]}
              alt={`${name} — ${lightboxIdx + 1}`}
              className="max-h-[85vh] max-w-[85vw] rounded-xl object-contain"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-12 text-3xl text-white/40 transition-colors hover:text-white"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              &#8250;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ================================================================
   Animated Metric — count-up on scroll
   ================================================================ */

function AnimatedMetric({
  value,
  isInView,
  delay,
}: {
  value: string;
  isInView: boolean;
  delay: number;
}) {
  // Parse "293,278+" → prefix="" num=293278 suffix="+"
  // Parse "¥9,530" → prefix="¥" num=9530 suffix=""
  // Parse "139套" → prefix="" num=139 suffix="套"
  const match = value.match(/^([^\d]*)([\d,]+)([^\d]*)$/);
  const prefix = match?.[1] ?? "";
  const num = match ? parseInt(match[2].replace(/,/g, ""), 10) : 0;
  const suffix = match?.[3] ?? "";

  const count = useMotionValue(0);
  const display = useTransform(count, (v) =>
    [prefix, Math.round(v).toLocaleString(), suffix].join(""),
  );

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, num, {
      duration: 2,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [isInView, num, delay, count]);

  return <motion.span>{display}</motion.span>;
}

/* ================================================================
   Flow Connector — animated shooting-star column
   ================================================================ */

function FlowConnector() {
  const SEGMENTS = 7;
  return (
    <div className="relative ml-4 flex shrink-0 flex-col items-center gap-[1px] py-1">
      {Array.from({ length: SEGMENTS }).map((_, i) => {
        const t = i / (SEGMENTS - 1); // 0 (top) → 1 (bottom)
        const opacity = 0.12 + t * 0.38; // dark top → cream bottom
        const isDot = i % 2 === 0;
        return isDot ? (
          <span
            key={i}
            className="text-[5px] leading-none"
            style={{ color: `rgba(254, 250, 243, ${opacity})` }}
          >
            •
          </span>
        ) : (
          <span
            key={i}
            className="h-[4px] w-px"
            style={{ backgroundColor: `rgba(254, 250, 243, ${opacity})` }}
          />
        );
      })}
      {/* Shooting star — glowing dot traveling top → bottom */}
      <motion.span
        className="absolute left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[#fefaf3]"
        style={{ boxShadow: "0 0 6px 1.5px rgba(254, 250, 243, 0.6)" }}
        animate={{ top: ["-2px", "calc(100% - 2px)"] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ================================================================
   Follower Growth Chart — single combined trend line
   ================================================================ */

function FollowerGrowthChart() {
  const W = 380;
  const H = 210;
  const PAD = { top: 20, right: 18, bottom: 30, left: 45 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const labels = ["12/19", "12/20", "12/21", "12/22", "12/23"];
  const n = labels.length;

  // Combined total — mountain peak 931 at 12/21, drops to 627 at 12/22
  const data = [10, 0, 931, 627, 20];
  const maxY = 1000; // fixed scale for readability
  const lineColor = "#f0c060";

  const xFor = (i: number) => PAD.left + (i / (n - 1)) * plotW;
  const yFor = (v: number) => PAD.top + plotH - (v / maxY) * plotH;
  const pts = data.map((v, i) => `${xFor(i)},${yFor(v)}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mt-4 w-full"
      style={{ maxWidth: W }}
      role="img"
      aria-label="社媒粉丝增长趋势图"
    >
      {/* Subtle horizontal grid lines */}
      {[0, 250, 500, 750, 1000].map((v) => {
        const y = yFor(v);
        return (
          <g key={v}>
            <line
              x1={PAD.left}
              y1={y}
              x2={PAD.left + plotW}
              y2={y}
              stroke="white"
              strokeOpacity={0.08}
              strokeWidth={1}
            />
            <text
              x={PAD.left - 6}
              y={y + 4}
              textAnchor="end"
              fill="white"
              fillOpacity={0.4}
              fontSize={11}
            >
              {v}
            </text>
          </g>
        );
      })}

      {/* X-axis labels */}
      {labels.map((l, i) => (
        <text
          key={l}
          x={xFor(i)}
          y={H - 4}
          textAnchor="middle"
          fill="white"
          fillOpacity={0.45}
          fontSize={10.5}
        >
          {l}
        </text>
      ))}

      {/* Area fill under the line */}
      <polygon
        points={`${xFor(0)},${yFor(0)} ${pts} ${xFor(n - 1)},${yFor(0)}`}
        fill={lineColor}
        fillOpacity={0.1}
      />

      {/* Trend line */}
      <polyline
        points={pts}
        fill="none"
        stroke={lineColor}
        strokeWidth={2.2}
        strokeOpacity={0.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data dots */}
      {data.map((v, i) => (
        <circle
          key={i}
          cx={xFor(i)}
          cy={yFor(v)}
          r={i === 2 ? 4 : 3}
          fill={i === 2 ? lineColor : "white"}
          fillOpacity={i === 2 ? 1 : 0.9}
          stroke={lineColor}
          strokeWidth={1.5}
        />
      ))}

      {/* Peak annotation */}
      <text
        x={xFor(2)}
        y={yFor(931) - 10}
        textAnchor="middle"
        fill={lineColor}
        fillOpacity={0.9}
        fontSize={12}
        fontWeight="bold"
      >
        931
      </text>
    </svg>
  );
}

/* ================================================================
   Main
   ================================================================ */
interface Props {
  project: ProjectDetailType;
}

export function ProjectDetail({ project }: Props) {
  const [phase, setPhase] = useState<HeroPhase>("enter");
  const heroImgRef = useRef<HTMLImageElement>(null);
  const [heroReady, setHeroReady] = useState(false);

  // Before paint: ensure page starts at top. useLayoutEffect runs synchronously
  // after DOM commit but BEFORE browser paints — no visible scroll jump.
  useLayoutEffect(() => {
    document.documentElement.scrollTop = 0;
  }, [project.slug]);

  // Safety timeout — force-start phase animation after 2.5s even if
  // hero image hasn't fired onLoad (e.g. network error, extreme slowness)
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 2500);
    return () => clearTimeout(t);
  }, []);

  // Detect hero image already loaded before React attaches onLoad
  // (cached images fire complete synchronously, onLoad never fires)
  useEffect(() => {
    if (heroImgRef.current?.complete) {
      setHeroReady(true);
    }
  }, []);

  // Phase timing: enter (0–1.5s) → blur (1.5–2.2s) → text (2.2s+)
  // Waits for hero image to fully load before starting, so the scale
  // + blur animation runs on a fully decoded image without stutter.
  useEffect(() => {
    if (!heroReady) return;
    const t1 = setTimeout(() => setPhase("blur"), 1500);
    const t2 = setTimeout(() => setPhase("text"), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [heroReady]);

  const idx = projects.findIndex((p) => p.slug === project.slug);
  const prevProject = idx > 0 ? projects[idx - 1] : null;
  const nextProject = idx < projects.length - 1 ? projects[idx + 1] : null;

  const roleItems = project.role.split("·").map((s) => s.trim());

  // Theme — fallback to default warm brown for projects without theme
  const t = project.theme;
  const heroGradient = {
    via: t?.heroGradientVia ?? "#dac5aa",
    to: t?.heroGradientTo ?? "#e6d5c0",
  };
  const contentGradient = {
    start: t?.contentGradientStart ?? "#e6d5c0",
    mid: t?.contentGradientMid ?? "#f2e8d8",
  };
  const heroObjectPos = t?.heroObjectPosition ?? "object-bottom";

  const metricsRef = useRef<HTMLDivElement>(null);
  const metricsInView = useInView(metricsRef, { once: true, amount: 0.4 });

  // Preload hero image BEFORE paint — prevents background-first-then-hero flash
  useLayoutEffect(() => {
    if (!project.hero) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = project.hero;
    document.head.appendChild(link);
    const img = new Image();
    img.src = project.hero;
    img.decode().then(() => {}).catch(() => {});
    return () => { document.head.removeChild(link); };
  }, [project.slug, project.hero]);

  // Preload all major assets: hero, gallery images, videos
  useEffect(() => {
    const assets: string[] = [];

    // 1. Always preload hero
    if (project.hero) assets.push(project.hero);

    // 2. Preload gallery images
    if (project.gallery) assets.push(...project.gallery);

    // 3. CNCY phone carousel assets
    if (project.slug === "cny-2025") {
      assets.push(
        "/projects/cny-2025/social/微信/微信优秀作品展示-投票.jpg",
        "/projects/cny-2025/social/微博/微博宣发-抽奖.jpg",
        "/projects/cny-2025/social/小红书/小红书宣发-抽奖.jpg",
        "/projects/cny-2025/social/kol/搜索组件.jpg",
        "/projects/cny-2025/social/kol/线下探店.jpg",
        "/projects/cny-2025/iPhone 16pro.png",
        ...Array.from({ length: 5 }, (_, i) => `/projects/cny-2025/social/粉丝快展打卡/图片${i + 1}.jpg`),
        ...Array.from({ length: 5 }, (_, i) => `/projects/cny-2025/social/晒单/小红书${String(i + 1).padStart(2, "0")}.jpg`),
      );
    }

    // 4. Video assets
    if (project.slug === "xmas-market") {
      assets.push("/projects/xmas-market/videos/xmas-market.mp4");
    }

    const links: HTMLLinkElement[] = [];
    assets.forEach((src) => {
      const isVideo = src.endsWith(".mp4");
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = isVideo ? "fetch" : "image";
      link.href = src;
      document.head.appendChild(link);
      links.push(link);
      if (!isVideo) {
        const img = new Image();
        img.src = src;
        img.decode().then(() => {}).catch(() => {});
      }
    });
    return () => {
      links.forEach((l) => document.head.removeChild(l));
    };
  }, [project.slug]);

  return (
    <>

      {/* Hidden preload — real DOM img tag forces browser to decode hero bitmap eagerly.
          Without this, the hero <img> starts loading during React commit but the browser
          hasn't decoded it yet, so the background gradient shows through first. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={project.hero} alt="" aria-hidden="true" loading="eager" decoding="sync"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", opacity: 0, pointerEvents: "none" }} />

      {/* ================================================================
          Hero
          ================================================================ */}
      {project.slug === "cny-2025" ? (
        <CnyHero />
      ) : (
        <section
          className="relative min-h-screen overflow-hidden"
          data-nav={
            project.slug === "xmas-market" || project.slug === "cny-2025"
              ? "keep-light-text"
              : undefined
          }
        >
          {/* Hero image */}
          <motion.img
            ref={heroImgRef}
            src={project.hero}
            alt={project.name}
            className={`absolute inset-0 h-full w-full object-cover ${heroObjectPos}`}
            fetchPriority="high"
            onLoad={() => setHeroReady(true)}
            initial={{ scale: 1.15 }}
            animate={
              heroReady
                ? {
                    scale: phase === "enter" ? 1 : 1.05,
                    filter:
                      phase === "enter" ? "blur(0px)" : "blur(12px)",
                  }
                : {
                    // Freeze at initial scale until image is fully decoded.
                    // Without this, Framer Motion starts the scale animation
                    // immediately on mount — progressive JPEG scans during the
                    // animation cause visible stutter (Bangkok Festival).
                    scale: 1.15,
                  }
            }
            transition={{
              scale: { duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] },
              filter: { duration: 1.2, ease: "easeOut" },
            }}
          />

          {/* Dark overlay when text appears */}
          <motion.div
            className="absolute inset-0"
            initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            animate={{
              backgroundColor:
                phase === "text"
                  ? "rgba(0, 0, 0, 0.32)"
                  : "rgba(0, 0, 0, 0)",
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Title block */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white"
            initial={{ opacity: 0, pointerEvents: "none" }}
            animate={{
              opacity: phase === "text" ? 1 : 0,
              pointerEvents: phase === "text" ? "auto" : "none",
            }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="font-display text-[clamp(42px,7vw,72px)] font-semibold leading-[1.05] text-white"
              initial={{ opacity: 0, y: 24 }}
              animate={{
                opacity: phase === "text" ? 1 : 0,
                y: phase === "text" ? 0 : 24,
              }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            >
              {project.name}
            </motion.h1>

            <motion.p
              className="mt-6 max-w-[680px] text-[16px] leading-relaxed text-white/80"
              initial={{ opacity: 0, y: 24 }}
              animate={{
                opacity: phase === "text" ? 1 : 0,
                y: phase === "text" ? 0 : 24,
              }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
            >
              {project.subtitle}
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0, y: 24 }}
              animate={{
                opacity: phase === "text" ? 1 : 0,
                y: phase === "text" ? 0 : 24,
              }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
            >
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/25 px-3 py-1 text-[12px] text-white/70 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Gradient to next section */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-48"
            style={{
              background: `linear-gradient(to bottom, transparent, ${heroGradient.via}40, ${heroGradient.to})`,
            }}
          />

          {/* ScrollIndicator — fades in with title + tags, same animation */}
          <motion.div
            initial={{ opacity: 0, pointerEvents: "none" }}
            animate={{
              opacity: phase === "text" ? 1 : 0,
              pointerEvents: phase === "text" ? "auto" : "none",
            }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
          >
            <ScrollIndicator targetId="content-start" />
          </motion.div>
        </section>
      )}

      {/* ================================================================
          Content — gradient transition from hero → page background
          ================================================================ */}
      <div
        id="content-start"
        style={{
          background:
            project.slug === "cny-2025"
              ? `linear-gradient(to bottom, #d47358 0%, #d47358 5%, #de9578 25%, #f5e6d3 55%, var(--color-bg-primary) 85%)`
              : `linear-gradient(to bottom, ${contentGradient.start} 0%, ${contentGradient.mid} 30%, var(--color-bg-primary) 60%)`,
        }}
      >
        <div className="relative mx-auto max-w-[1100px]">
          {/* ================================================================
              CNY 2025: Phone Carousel — social media showcase
              ================================================================ */}
          {project.slug === "cny-2025" && (
            <div data-nav="keep-light-text">
              <PhoneCarousel />
            </div>
          )}

          {/* ================================================================
              CNY 2025: Horizontal Scroll — Pop-Up Exhibition walkthrough
              ================================================================ */}
          {project.slug === "cny-2025" && (
            <HorizontalScroll
              title="快展打卡"
              subtitle="Pop-Up Exhibition"
              cards={[
                { type: "image", src: "/projects/cny-2025/hero.jpg", halfWidth: true },
                { type: "image", src: "/projects/cny-2025/scene/展区全景.jpg", halfWidth: true },
                { type: "image", src: "/projects/cny-2025/打卡有礼1.jpg" },
                { type: "image", src: "/projects/cny-2025/打卡有礼2.jpg" },
                {
                  type: "phone", assets: Array.from({ length: 5 }, (_, i) => ({
                    src: `/projects/cny-2025/social/粉丝快展打卡/图片${i + 1}.jpg`,
                  }))
                },
              ]}
            />
          )}

          {/* ================================================================
              Phone Review — video + review in iPhone frames
              ================================================================ */}
          {project.phoneReview ? (
            <PhoneReview
              video={project.phoneReview.video}
              reviewImage={project.phoneReview.reviewImage}
              phoneFrame={project.phoneReview.phoneFrame}
            />
          ) : project.videos && project.videos.length > 0 ? (
            <motion.section
              className="mt-0 px-6 pt-10 sm:px-8"
              data-nav={
                project.slug === "xmas-market" || project.slug === "cny-2025"
                  ? "keep-light-text"
                  : "keep-dark-text"
              }
              variants={blurReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <h3 className={`text-sm tracking-[0.3em] uppercase ${project.slug === "sanya-hotel" ? "text-accent" : "text-white/70"}`}>
                {(project.slug === "sanya-hotel" || project.slug === "xmas-market") ? "Campaign Film" : "Execution / Campaign Film"}
              </h3>

              <div
                className="mx-auto mt-8"
                style={{ maxWidth: project.videoSectionMaxWidth || "100%" }}
              >
                {/* Single video: flex layout — video fixed width, right column independent */}
                {project.videos.length === 1 ? (
                  <div className="flex gap-10">
                    {/* Video */}
                    <div className="shrink-0" style={{ width: project.videoMaxWidth || "280px" }}>
                      <HoverVideo
                        src={project.videos[0]}
                        className="aspect-[9/16] w-full rounded-2xl object-cover"
                      />
                      {project.videoCaptions?.[0] && (
                        <p className="mt-3 text-center text-[13px] tracking-wide text-text-tertiary">
                          {project.videoCaptions[0]}
                        </p>
                      )}
                    </div>

                    {/* Right column: flow + growth, matches video height */}
                    <div className="flex flex-1 flex-col gap-4">
                    {/* Interaction Flow */}
                    <motion.div
                      className="relative flex flex-1 flex-col justify-center rounded-2xl border border-[#d49090]/30 bg-[#b85c5c] px-3 py-4 shadow-md"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <span className="text-[10px] tracking-[0.25em] text-[#fefaf3]/70 uppercase">
                        Interaction Flow
                      </span>
                      <div className="mt-3 flex flex-col items-center gap-2">
                        {[
                          { step: "01", title: "扫码关注", desc: "关注品牌小红书 / 公众号 / 抖音" },
                          { step: "02", title: "扭蛋抽奖", desc: "参与扭蛋机互动抽奖" },
                          { step: "03", title: "领取奖品", desc: "赢取老板仔海苔与周边" },
                        ].map((item, idx, arr) => (
                          <div key={item.step} className="flex w-full items-center gap-1.5">
                            <span className="font-display text-[20px] font-bold leading-none text-[#fefaf3]/25">
                              {item.step}
                            </span>
                            <div className="flex-1">
                              <p className="text-[12px] font-medium text-[#fefaf3]">
                                {item.title}
                              </p>
                              <p className="mt-1 text-[11px] leading-relaxed text-[#fefaf3]/70">
                                {item.desc}
                              </p>
                            </div>
                            <FlowConnector />
                          </div>
                        ))}
                      </div>
                      {/* Mascot — in the gap between text & connector, aligned with 02/03 */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/projects/xmas-market/表情包.png"
                        alt="mascot"
                        className="pointer-events-none absolute right-[16px] bottom-[8%] w-[40px] sm:w-[100px] opacity-90"
                      />
                    </motion.div>

                    {/* Follower Growth Chart */}
                    <motion.div
                      className="flex flex-1 flex-col rounded-2xl border border-[#d49090]/30 bg-[#b85c5c] px-4 py-4 shadow-md"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="mt-2">
                        <p className="text-[13px] font-medium text-[#fefaf3]">社媒粉丝增长趋势</p>
                        <span className="mt-0.5 block text-[10px] tracking-[0.25em] text-[#fefaf3]/50 uppercase">
                          Social Growth
                        </span>
                      </div>
                      <div className="flex flex-1 items-center justify-center pl-0">
                        <FollowerGrowthChart />
                      </div>
                    </motion.div>
                  </div>
                </div>
              ) : (
                /* Multi-video: grid layout */
                <div className="grid gap-3 sm:grid-cols-2">
                  {project.videos.map((src, i) => (
                    <div key={src} className="mx-auto" style={{ maxWidth: project.videoMaxWidth || "100%" }}>
                      <HoverVideo
                        src={src}
                        className="aspect-[9/16] w-full rounded-2xl object-cover"
                      />
                      {project.videoCaptions?.[i] && (
                        <p className="mt-3 text-center text-[13px] tracking-wide text-text-tertiary">
                          {project.videoCaptions[i]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              </div>
            </motion.section>
          ) : project.routeMap ? (
            <motion.section
              className="mt-0 px-6 pt-14 sm:px-8"
              data-nav="keep-dark-text"
              variants={blurReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <h3 className="text-sm tracking-[0.3em] uppercase text-text-tertiary">
                Four City Tour / 巡回路线
              </h3>

              <div className="mt-10">
                <RouteMap />
              </div>
            </motion.section>
          ) : project.kvImage ? (
            <motion.section
              className="mt-0 px-6 pt-12 sm:px-8"
              variants={blurReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <h3 className="text-sm tracking-[0.3em] text-white/70 uppercase">
                Key Visual
              </h3>

              <motion.div
                className="mt-8 overflow-hidden rounded-2xl"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.kvImage}
                  alt={project.name}
                  className="w-full rounded-2xl object-cover"
                />
              </motion.div>
            </motion.section>
          ) : project.galleryFirst ? (
            <GalleryFilmstrip images={project.gallery} name={project.name} compact />
          ) : null}

          {/* ================================================================
              Metrics — spring bounce + count-up on scroll
              ================================================================ */}
          <motion.section
            ref={metricsRef}
            data-nav="keep-dark-text"
            className="mt-10 px-6 sm:mt-14 sm:px-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              {project.metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  className="relative flex flex-col items-center overflow-hidden rounded-2xl border border-border bg-bg-secondary/60 px-3 py-8 sm:py-10"
                  variants={springItem}
                  whileHover={{
                    scale: 1.04,
                    borderColor: "rgba(200, 151, 94, 0.3)",
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 20,
                    },
                  }}
                >
                  <span className="pointer-events-none absolute -bottom-2 right-4 select-none font-display text-[64px] font-bold leading-none text-text-primary/[0.03]">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="relative font-display text-[clamp(28px,4vw,48px)] font-bold leading-none text-accent">
                    <AnimatedMetric
                      value={m.value}
                      isInView={metricsInView}
                      delay={0.3 + i * 0.12}
                    />
                  </span>
                  <span className="relative mt-3 text-[13px] tracking-wide text-text-tertiary">
                    {m.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ================================================================
              Magazine Text — clip-path unveil
              ================================================================ */}
          <motion.section
            className="mt-12 px-6 sm:mt-16 sm:px-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="grid gap-x-16 gap-y-12 sm:grid-cols-2">
              {/* Left — Background */}
              <motion.div variants={clipReveal}>
                <span className="font-display text-[11px] font-semibold tracking-[0.25em] text-accent uppercase">
                  Introduction
                </span>
                <h3 className="mt-4 font-display text-[22px] font-semibold leading-snug text-text-primary">
                  项目介绍
                </h3>
                <p className="mt-6 text-[15px] leading-relaxed text-text-secondary">
                  {project.description}
                </p>
              </motion.div>

              {/* Right — Role */}
              <motion.div variants={clipReveal}>
                <span className="font-display text-[11px] font-semibold tracking-[0.25em] text-accent uppercase">
                  My Role
                </span>
                <h3 className="mt-4 font-display text-[22px] font-semibold leading-snug text-text-primary">
                  我的角色
                </h3>
                <motion.ul
                  className="mt-6 space-y-3"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {roleItems.map((item) => (
                    <motion.li
                      key={item}
                      className="flex items-start gap-3 text-[15px] leading-relaxed text-text-secondary"
                      variants={roleItem}
                    >
                      <span className="mt-[5px] block h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            </div>
          </motion.section>

          {/* ================================================================
              Gallery — auto-scroll filmstrip + lightbox (skip for CNY)
              ================================================================ */}
          {project.slug !== "cny-2025" && !project.galleryFirst && (
            <GalleryFilmstrip images={project.gallery} name={project.name} />
          )}

          {/* ================================================================
              Bottom Navigation
              ================================================================ */}
          <motion.nav
            className="mx-6 mt-10 flex items-center justify-between border-t border-border pt-6 sm:mx-8"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            <div>
              {prevProject && (
                <Link
                  href={`/projects/${prevProject.slug}`}
                  className="cursor-hover group flex flex-col text-left"
                >
                  <span className="text-[11px] tracking-widest text-text-tertiary uppercase">
                    &larr; PREV
                  </span>
                  <span className="mt-1 text-[15px] font-medium text-text-secondary transition-colors group-hover:text-accent">
                    {prevProject.name}
                  </span>
                </Link>
              )}
            </div>
            <div>
              {nextProject && (
                <Link
                  href={`/projects/${nextProject.slug}`}
                  className="cursor-hover group flex flex-col text-right"
                >
                  <span className="text-[11px] tracking-widest text-text-tertiary uppercase">
                    NEXT &rarr;
                  </span>
                  <span className="mt-1 text-[15px] font-medium text-text-secondary transition-colors group-hover:text-accent">
                    {nextProject.name}
                  </span>
                </Link>
              )}
            </div>
          </motion.nav>

          {/* ================================================================
              Fixed Back Button
              ================================================================ */}
        </div>
      </div>
    </>
  );
}
