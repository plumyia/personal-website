"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

/* ================================================================
   Phone Carousel — center-focus circular phone group
   Uses iPhone 16 Pro PNG as frame overlay. Center sharp, sides
   blurred. Click sides / drag to switch. Circular wrap-around.
   ================================================================ */

/* ---- Types ---- */

interface Asset {
  src: string;
}

interface PhoneData {
  id: string;
  hoverLabel: string;
  type: "screenshot" | "video" | "stacked-images";
  assets: Asset[];
  screenInset?: { top: string; left: string; right: string; bottom: string };
}

/* ---- Data ---- */

const PHONES: PhoneData[] = [
  {
    id: "wechat",
    hoverLabel: "微信优秀作品展示-投票",
    type: "stacked-images",
    assets: [
      { src: "/projects/cny-2025/social/微信/微信优秀作品展示-投票.jpg" },
    ],
    screenInset: { top: "3.3%", left: "6.1%", right: "6.1%", bottom: "2.9%" },
  },
  {
    id: "weibo",
    hoverLabel: "微博宣发-抽奖",
    type: "stacked-images",
    assets: [
      { src: "/projects/cny-2025/social/微博/微博宣发-抽奖.jpg" },
    ],
  },
  {
    id: "red",
    hoverLabel: "小红书宣发-抽奖",
    type: "stacked-images",
    assets: [
      { src: "/projects/cny-2025/social/小红书/小红书宣发-抽奖.jpg" },
    ],
  },
  {
    id: "star-xingfei",
    hoverLabel: "明星艺人开箱-邢菲",
    type: "video",
    assets: [
      { src: "/projects/cny-2025/social/kol/明星艺人开箱-邢菲.mp4" },
    ],
  },
  {
    id: "star-daigaozheng",
    hoverLabel: "明星艺人开箱-代高政",
    type: "video",
    assets: [
      { src: "/projects/cny-2025/social/kol/明星艺人开箱-代高政.mp4" },
    ],
  },
  {
    id: "star-jili",
    hoverLabel: "明星艺人开箱-纪李",
    type: "video",
    assets: [
      { src: "/projects/cny-2025/social/kol/明星艺人开箱-纪李.mp4" },
    ],
  },
  {
    id: "kols-yeren",
    hoverLabel: "达人测评-野人哥p",
    type: "video",
    assets: [
      { src: "/projects/cny-2025/social/kol/达人测评-野人哥p.mp4" },
    ],
  },
  {
    id: "kols-roua",
    hoverLabel: "达人测评-肉阿圆圆",
    type: "video",
    assets: [
      { src: "/projects/cny-2025/social/kol/达人测评-肉阿圆圆.mp4" },
    ],
  },
  {
    id: "ugc",
    hoverLabel: "用户晒单",
    type: "stacked-images",
    assets: Array.from({ length: 5 }, (_, i) => ({
      src: `/projects/cny-2025/social/晒单/小红书${String(i + 1).padStart(2, "0")}.jpg`,
    })),
  },
  {
    id: "tan-dian",
    hoverLabel: "达人探店",
    type: "stacked-images",
    assets: [
      { src: "/projects/cny-2025/social/kol/搜索组件.jpg" },
      { src: "/projects/cny-2025/social/kol/线下探店.jpg" },
    ],
  },
];

const TOTAL = PHONES.length;

/* ---- Constants ---- */

const PHONE_W = 240; // center phone width (px) — matches iPhone PNG width
const PHONE_GAP = 230; // x-offset for side phones
const SIDE_SCALE = 0.78;
const SIDE_OPACITY = 0.45;
const SIDE_BLUR = 4;
const SWIPE_THRESHOLD = 60;

// Screen inset within iPhone PNG (percentage of phone frame)
// iPhone 16 Pro PNG: 1400×2810, bezel ~2-3% of width
const SCREEN_INSET = { top: "3.3%", left: "6.1%", right: "6.1%", bottom: "2.9%" };

/* ---- Circular offset helper ---- */

function circOffset(i: number, active: number, total: number): number {
  let d = i - active;
  if (d > total / 2) d -= total;
  if (d < -total / 2) d += total;
  return d;
}

function circNext(active: number, total: number): number {
  return (active + 1) % total;
}

function circPrev(active: number, total: number): number {
  return (active - 1 + total) % total;
}

/* ================================================================
   Screen Content
   ================================================================ */

function ScreenContent({
  phone,
  videoRefs,
}: {
  phone: PhoneData;
  videoRefs: React.MutableRefObject<Map<string, HTMLVideoElement>>;
}) {
  switch (phone.type) {
    case "video":
      return (
        <video
          ref={(el) => {
            if (el) videoRefs.current.set(phone.id, el);
          }}
          src={phone.assets[0].src}
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        />
      );

    case "screenshot":
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={phone.assets[0].src}
          alt={phone.hoverLabel}
          className="h-full w-full object-cover"
          draggable={false}
        />
      );

    case "stacked-images":
      return (
        <div className="phone-scroll h-full overflow-y-auto scroll-smooth bg-black" style={{ fontSize: 0 }}>
          <style>{`
            .phone-scroll::-webkit-scrollbar {
              width: 3px;
            }
            .phone-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .phone-scroll::-webkit-scrollbar-thumb {
              background: rgba(255,255,255,0.2);
              border-radius: 2px;
            }
          `}</style>
          {phone.assets.map((asset, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={asset.src}
              alt=""
              className="block w-full"
              loading="eager"
              decoding="sync"
              style={i > 0 ? { marginTop: "-3px" } : undefined}
              draggable={false}
            />
          ))}
        </div>
      );

    default:
      return null;
  }
}

/* ================================================================
   Phone Frame — iPhone 16 Pro PNG overlay
   ================================================================ */

function PhoneFrame({
  phone,
  isHovered,
  videoRefs,
}: {
  phone: PhoneData;
  isHovered: boolean;
  videoRefs: React.MutableRefObject<Map<string, HTMLVideoElement>>;
}) {
  return (
    <div
      className="cursor-phone relative select-none"
      style={{
        filter: isHovered
          ? "drop-shadow(0 24px 60px rgba(0,0,0,0.5)) drop-shadow(0 0 0 1px rgba(240,192,96,0.25))"
          : "drop-shadow(0 8px 30px rgba(0,0,0,0.35))",
        transition: "filter 0.3s ease",
      }}
    >
      {/* Screen content — sits behind the iPhone frame */}
      <div
        className="absolute overflow-hidden bg-black"
        style={{
          top: phone.screenInset?.top ?? SCREEN_INSET.top,
          left: phone.screenInset?.left ?? SCREEN_INSET.left,
          right: phone.screenInset?.right ?? SCREEN_INSET.right,
          bottom: phone.screenInset?.bottom ?? SCREEN_INSET.bottom,
          borderRadius: "10% / 5%",
        }}
      >
        <ScreenContent phone={phone} videoRefs={videoRefs} />
      </div>

      {/* iPhone frame overlay — transparent screen, bezel visible */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/projects/cny-2025/iPhone 16pro.png"
        alt=""
        className="relative z-10 block w-full"
        draggable={false}
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}

/* ================================================================
   Main Component
   ================================================================ */

export function PhoneCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [winW, setWinW] = useState(0);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  /* ---- Track window width for responsive sizing ---- */
  useEffect(() => {
    const handle = () => setWinW(window.innerWidth);
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  const isMobile = winW > 0 && winW < 640;
  const phoneW = isMobile ? 180 : PHONE_W;
  const phoneGap = isMobile ? 120 : PHONE_GAP;
  const sideScale = isMobile ? 0.72 : SIDE_SCALE;
  const carouselHeight = isMobile ? 380 : 520;

  /* ---- Video playback on hover ---- */
  useEffect(() => {
    videoRefs.current.forEach((video, id) => {
      if (id === hoveredId) {
        video.currentTime = 0;
        video.play().catch(() => { });
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [hoveredId]);

  /* ---- Keyboard nav (circular) ---- */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActiveIndex((i) => circPrev(i, TOTAL));
      }
      if (e.key === "ArrowRight") {
        setActiveIndex((i) => circNext(i, TOTAL));
      }
    },
    [],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const hoveredPhone = hoveredId
    ? PHONES.find((p) => p.id === hoveredId)
    : null;

  return (
    <section
      className="relative overflow-hidden px-4 pt-4 pb-4 sm:pt-8 sm:pb-6"
      style={{ willChange: "transform", transform: "translateZ(0)" }}
    >
      {/* ---- Section Title ---- */}
      <div className="mb-5 text-center sm:mb-7">
        <h3 className="font-display text-[clamp(20px,3vw,28px)] font-semibold tracking-wide text-[#f0c060]">
          线上传播
        </h3>
        <p className="mt-1 text-[11px] tracking-[0.3em] text-[#f0c060]/50 uppercase">
          Online Presence
        </p>
      </div>

      {/* Hidden preload images — real DOM elements so browser decodes them eagerly.
          The useEffect Image.decode() approach isn't enough; the browser deprioritizes
          off-screen decode requests. Actual <img> tags in DOM get higher priority. */}
      <div aria-hidden="true" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", opacity: 0, pointerEvents: "none" }}>
        {PHONES.filter(p => p.type !== "video").flatMap(p => p.assets).map((a, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={a.src} alt="" loading="eager" decoding="sync" />
        ))}
      </div>

      {/* ---- Carousel area ---- */}
      <div
        className="relative flex items-center justify-center"
        style={{ minHeight: carouselHeight }}
      >
        {PHONES.map((phone, i) => {
          const offset = circOffset(i, activeIndex, TOTAL);
          const hidden = Math.abs(offset) > 1;

          const isCenter = offset === 0;
          const isHovered = hoveredId === phone.id;
          const isSide = !isCenter;

          return (
            <motion.div
              key={phone.id}
              className="absolute"
              style={{ width: phoneW, visibility: hidden ? "hidden" : "visible", pointerEvents: hidden ? "none" : "auto" }}
              animate={{
                x: offset * phoneGap,
                y: isHovered ? -10 : 0,
                scale: isCenter ? 1 : sideScale,
                opacity: hidden ? 0 : isCenter ? 1 : SIDE_OPACITY,
                filter: `blur(${isCenter ? 0 : SIDE_BLUR}px)`,
                zIndex: isCenter ? 2 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 28,
                mass: 0.8,
              }}
              drag={isCenter ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (info.offset.x < -SWIPE_THRESHOLD) {
                  setActiveIndex((prev) => circNext(prev, TOTAL));
                } else if (info.offset.x > SWIPE_THRESHOLD) {
                  setActiveIndex((prev) => circPrev(prev, TOTAL));
                }
              }}
              onClick={() => {
                if (isSide) setActiveIndex(i);
              }}
              onMouseEnter={() => setHoveredId(phone.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <PhoneFrame
                phone={phone}
                isHovered={isHovered}
                videoRefs={videoRefs}
              />

              {/* Side phone overlay */}
              {isSide && (
                <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-white/5" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ---- Hover label ---- */}
      <div className="mt-1 flex items-center justify-center">
        <motion.p
          className="rounded-full bg-black/45 px-5 py-2 text-[13px] tracking-wide text-[#fef5e7] backdrop-blur-sm"
          animate={{
            opacity: hoveredId ? 1 : 0,
            y: hoveredId ? 0 : 6,
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {hoveredPhone ? hoveredPhone.hoverLabel : " "}
        </motion.p>
      </div>
    </section>
  );
}
