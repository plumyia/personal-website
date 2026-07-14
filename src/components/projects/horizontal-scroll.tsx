"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";

/* ================================================================
   Horizontal Scroll Section
   Motion.dev React Scroll Horizontal pattern.
   Card types: "image" (half/full width) and "phone" (iPhone frame).
   ================================================================ */

/* ---- Card types ---- */

interface ImageCard {
  type: "image";
  src: string;
  /** 50% width for scene photos */
  halfWidth?: boolean;
}

interface PhoneCard {
  type: "phone";
  /** Stacked images shown inside iPhone frame, vertically scrollable */
  assets: { src: string }[];
}

type Card = ImageCard | PhoneCard;

interface HorizontalScrollProps {
  cards: Card[];
  title?: string;
  subtitle?: string;
}

/* ---- iPhone frame constants (matching phone-carousel) ---- */

const SCREEN_INSET = { top: "3.3%", left: "6.1%", right: "6.1%", bottom: "2.9%" };

/* ================================================================
   Phone Frame Card
   ================================================================ */

function PhoneFrameCard({ assets, cardHeight }: { assets: { src: string }[]; cardHeight: string }) {
  return (
    <div className="cursor-phone relative shrink-0 select-none" style={{ height: cardHeight, aspectRatio: "1400/2810" }}>
      {/* Screen content — sits behind the iPhone frame */}
      <div
        className="absolute overflow-hidden bg-black"
        style={{
          top: SCREEN_INSET.top,
          left: SCREEN_INSET.left,
          right: SCREEN_INSET.right,
          bottom: SCREEN_INSET.bottom,
          borderRadius: "10% / 5%",
        }}
      >
        <div className="phone-scroll-h h-full overflow-y-auto scroll-smooth bg-black">
          <style>{`
            .phone-scroll-h::-webkit-scrollbar { width: 3px; }
            .phone-scroll-h::-webkit-scrollbar-track { background: transparent; }
            .phone-scroll-h::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
          `}</style>
          {assets.map((asset, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={asset.src}
              alt=""
              className="block w-full"
              loading="eager"
              style={i > 0 ? { marginTop: "-2px" } : undefined}
              draggable={false}
            />
          ))}
        </div>
      </div>

      {/* iPhone frame overlay */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/projects/cny-2025/iPhone 16pro.png"
        alt=""
        className="relative z-10 block h-full w-full"
        draggable={false}
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}

/* ================================================================
   Main Component
   ================================================================ */

export function HorizontalScroll({
  cards,
  title,
  subtitle,
}: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track when horizontal scrolling starts — switch header to dark text
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > 0.01 && !isScrolling) setIsScrolling(true);
    if (v <= 0.01 && isScrolling) setIsScrolling(false);
  });

  // Measure how far the track needs to scroll so the last card lands at center-right
  useEffect(() => {
    const measure = () => {
      if (trackRef.current && containerRef.current) {
        const trackWidth = trackRef.current.scrollWidth;
        const containerWidth = containerRef.current.offsetWidth;
        // Target: last card center at ~58% from viewport left (slightly right of center)
        const targetCenter = containerWidth * 0.58;
        // Last card approximate center position within track
        const lastCard = trackRef.current.lastElementChild as HTMLElement | null;
        const lastW = lastCard?.offsetWidth ?? 0;
        const lastCenterInTrack = trackWidth - lastW / 2;
        const dist = Math.max(0, lastCenterInTrack - targetCenter);
        setScrollDistance(dist);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    // Re-measure after images load (affects track width)
    const imgs = trackRef.current?.querySelectorAll("img");
    imgs?.forEach((img) => img.addEventListener("load", measure));
    return () => {
      window.removeEventListener("resize", measure);
      imgs?.forEach((img) => img.removeEventListener("load", measure));
    };
  }, [cards]);

  // Horizontal scroll completes at ~65% of vertical progress.
  // Remaining 35% lets user scroll past with the phone parked at center-right.
  const x = useTransform(scrollYProgress, [0, 0.65], [0, -scrollDistance]);
  // Spring physics for smooth, gliding feel
  const springX = useSpring(x, { stiffness: 70, damping: 26, mass: 0.4 });

  // Progress bar
  const barScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Preload all phone card images so they're cached before the user scrolls to them.
  // Without this, the phone screen area shows black while images download.
  const phoneAssets = cards
    .filter((c): c is PhoneCard => c.type === "phone")
    .flatMap((c) => c.assets.map((a) => a.src));

  return (
    <section
      ref={containerRef}
      className="relative"
      data-nav={isScrolling ? "keep-dark-text" : undefined}
      style={{ height: `${cards.length * 55 + 25}vh` }}
    >
      {/* Hidden preload images — ensure phone content is cached before visible */}
      <div aria-hidden="true" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }}>
        {phoneAssets.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="" />
        ))}
      </div>
      {/* Sticky wrapper */}
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-8">
        {/* Title */}
        {(title || subtitle) && (
          <div className="mb-10 shrink-0 px-6 text-center sm:px-8">
            {title && (
              <h3 className="font-display text-[clamp(20px,3vw,28px)] font-semibold tracking-wide text-[#f0c060]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-[11px] tracking-[0.3em] text-[#f0c060]/50 uppercase">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Progress bar */}
        <div className="mx-6 mb-6 h-[2px] shrink-0 rounded-full bg-white/15 sm:mx-8">
          <motion.div
            className="h-full rounded-full bg-[#f0c060]"
            style={{ scaleX: barScaleX, transformOrigin: "left" }}
          />
        </div>

        {/* Horizontal track */}
        <div className="relative flex-1 overflow-hidden">
          <motion.div
            ref={trackRef}
            style={{ x: springX }}
            className="flex h-full items-center gap-[20px] px-6 sm:px-8"
          >
            {cards.map((card, i) => {
              // Target height for portrait / phone cards — matches scene image visible height.
              // Scene image at halfWidth (max 480px) ÷ 1.333 ≈ 360px.
              const cardH = "clamp(210px, 28vw, 360px)";

              if (card.type === "phone") {
                return <PhoneFrameCard key={i} assets={card.assets} cardHeight={cardH} />;
              }

              // Image card — all cards share same height so rounded corners are visible
              const isHalf = card.halfWidth;
              return (
                <div
                  key={i}
                  className="relative shrink-0 overflow-hidden rounded-2xl"
                  style={{
                    width: isHalf ? "clamp(280px, 38vw, 480px)" : "auto",
                    height: cardH,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.src}
                    alt=""
                    className="h-full w-auto max-w-full rounded-2xl object-contain"
                    draggable={false}
                  />
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
