"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

/* ================================================================
   PhoneReview — two iPhone 16 Pro frames side by side
   Left: video (hover to play, continues after)
   Right: review long image (scrollable)

   Size matches CNY PhoneCarousel: 240px desktop / 180px mobile
   ================================================================ */

interface Props {
  video: string;
  reviewImage: string;
  phoneFrame: string;
}

/* Screen inset within iPhone 16 Pro PNG (1400×2810) — same as CNY */
const SCREEN_INSET = { top: "3.3%", left: "6.1%", right: "6.1%", bottom: "2.9%" };

export function PhoneReview({ video, reviewImage, phoneFrame }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  const handleFirstHover = useCallback(() => {
    if (!hasPlayed && videoRef.current) {
      videoRef.current.play().catch(() => { });
      setHasPlayed(true);
    }
  }, [hasPlayed]);

  // Three-layer preload, same as CNY PhoneCarousel:
  // 1. <link rel="preload"> — highest download priority (bypasses heuristics)
  // 2. new Image() + .decode() — forces browser to decode bitmap now
  // 3. Hidden <img> tags in JSX below — keeps decoded bitmaps in compositor cache
  useEffect(() => {
    const assets = [phoneFrame, reviewImage];
    const links: HTMLLinkElement[] = [];

    assets.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
      links.push(link);

      const img = new Image();
      img.src = src;
      img.decode().then(() => {}).catch(() => {});
    });

    return () => {
      links.forEach((l) => document.head.removeChild(l));
    };
  }, [phoneFrame, reviewImage]);

  return (
    <section className="mt-0 px-6 pt-12 sm:px-8">
      {/* Hidden preload — real DOM <img> tags ensure phone frame + review
          image are decoded before user scrolls into view. Without this, the
          browser lazily decodes them on-scroll, exposing the black screen
          background during the decode delay. Same approach as CNY PhoneCarousel. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={phoneFrame} alt="" loading="eager" decoding="sync" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={reviewImage} alt="" loading="eager" decoding="sync" />
      </div>

      <h3 className="text-sm tracking-[0.3em] uppercase text-text-tertiary">
        Campaign Film / Review
      </h3>

      <div className="mt-8 flex flex-wrap items-start justify-center gap-8 sm:gap-10">
        {/* ============================================================
            Left — Video in iPhone frame
            ============================================================ */}
        <div className="flex justify-center">
          <PhoneFrame frameSrc={phoneFrame}>
            <video
              ref={videoRef}
              src={video}
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover"
              onMouseEnter={handleFirstHover}
            />
          </PhoneFrame>
        </div>

        {/* ============================================================
            Right — Review long image in iPhone frame (scrollable)
            ============================================================ */}
        <div className="flex justify-center">
          <PhoneFrame frameSrc={phoneFrame}>
            <div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-black scrollbar-hide">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={reviewImage}
                alt="Review"
                className="block w-full"
                loading="eager"
                decoding="sync"
                style={{ backfaceVisibility: "hidden", transform: "translateZ(0)" }}
                draggable={false}
              />
            </div>
          </PhoneFrame>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   PhoneFrame — sizes match CNY PhoneCarousel
   ================================================================ */

function PhoneFrame({
  frameSrc,
  children,
}: {
  frameSrc: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="relative w-full max-w-[180px] sm:max-w-[240px]"
      style={{ aspectRatio: "1400 / 2810", backfaceVisibility: "hidden" }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Screen area */}
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
        {children}
      </div>

      {/* iPhone frame overlay */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={frameSrc}
        alt=""
        className="pointer-events-none relative z-10 block w-full"
        loading="eager"
        decoding="sync"
        draggable={false}
      />
    </motion.div>
  );
}
