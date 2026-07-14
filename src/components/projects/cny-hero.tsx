"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { ScrollIndicator } from "@/components/shared/scroll-indicator";

/* ================================================================
   CNY Hero — 3-phase cinematic entrance
   Phase 1 (0–1.2s): Two gift boxes rise + float
   Phase 2 (1.2–2.8s): Golden arc draws (CSS GPU animation, no stutter)
   Phase 2b (3.0s+): 5 nodes + labels appear sequentially
   Phase 3 (4.2s+):  Title + metrics fade in
   ================================================================ */

const HIGHLIGHTS = [
  { label: "官方社媒", x: 140, y: 190 },
  { label: "明星开箱", x: 275, y: 126 },
  { label: "用户晒单", x: 500, y: 85 },
  { label: "达人测评&探店", x: 725, y: 126 },
  { label: "新春快展", x: 860, y: 190 },
];

const bezierPoint = (t: number) => {
  const x = (1 - t) ** 2 * 50 + 2 * (1 - t) * t * 500 + t ** 2 * 950;
  const y = (1 - t) ** 2 * 250 + 2 * (1 - t) * t * -80 + t ** 2 * 250;
  return { x: Math.round(x), y: Math.round(y) };
};

const MASCOT_POINTS = Array.from({ length: 12 }, (_, i) => bezierPoint(i / 11));
const MASCOT_SIZE = 60;

/* Timing constants — single source of truth */
const ARC_START = 1200; // ms — arc begins drawing
const ARC_DURATION = 1.6; // seconds
const ARC_END = ARC_START + ARC_DURATION * 1000; // 2800ms
const NODES_START = 3000; // ms — first node appears after arc done
const NODE_STAGGER = 150; // ms between each node
const PHASE3_START = 4200; // ms — title fades in

export function CnyHero() {
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [nodesVisible, setNodesVisible] = useState(false);
  const [arcLen, setArcLen] = useState(1300); // approx, measured on mount
  const [mascotStarted, setMascotStarted] = useState(false);
  const mascotControls = useAnimationControls();

  // Measure actual arc path length on mount
  useEffect(() => {
    const el = document.getElementById("cny-arc-path") as SVGPathElement | null;
    if (el) setArcLen(Math.ceil(el.getTotalLength()));
  }, []);

  // Phase timing
  useEffect(() => {
    const t2 = setTimeout(() => setPhase(2), ARC_START);
    const tNodes = setTimeout(() => setNodesVisible(true), NODES_START);
    const t3 = setTimeout(() => setPhase(3), PHASE3_START);
    return () => {
      clearTimeout(t2);
      clearTimeout(tNodes);
      clearTimeout(t3);
    };
  }, []);

  // Mascot starts walking after arc completes
  useEffect(() => {
    if (!nodesVisible || mascotStarted) return;
    const t = setTimeout(() => {
      setMascotStarted(true);
      mascotControls.start({
        opacity: 1,
        x: MASCOT_POINTS.map((p) => p.x - MASCOT_SIZE / 2),
        y: MASCOT_POINTS.map((p) => p.y - MASCOT_SIZE - 4),
        transition: {
          x: {
            duration: 7,
            repeat: Infinity,
            ease: "linear",
            times: MASCOT_POINTS.map((_, i) => i / 11),
            repeatDelay: 2,
          },
          y: {
            duration: 7,
            repeat: Infinity,
            ease: "linear",
            times: MASCOT_POINTS.map((_, i) => i / 11),
            repeatDelay: 2,
          },
          opacity: { duration: 0.4 },
        },
      });
    }, 600);
    return () => clearTimeout(t);
  }, [nodesVisible, mascotStarted, mascotControls]);

  return (
    <section
      data-nav="keep-light-text"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#843535] via-[#b34d40] to-[#c96b55] pt-16"
    >
      {/* Radial glow behind gift boxes */}
      <div
        className="pointer-events-none absolute left-1/2 top-[60%] h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(240,192,96,0.14) 0%, transparent 70%)",
        }}
      />

      {/* CSS keyframes for GPU-accelerated arc drawing */}
      <style>{`
        #cny-arc-path {
          stroke-dasharray: ${arcLen};
          stroke-dashoffset: ${arcLen};
        }
        .cny-arc-draw #cny-arc-path {
          animation: cnyDrawArc ${ARC_DURATION}s linear forwards;
        }
        @keyframes cnyDrawArc {
          from { stroke-dashoffset: ${arcLen}; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* ================================================================
          SVG Layer
          ================================================================ */}
      <svg
        viewBox="0 0 1000 500"
        className={`absolute inset-0 h-full w-full ${phase >= 2 ? "cny-arc-draw" : ""}`}
      >
        {/* Golden arc — CSS GPU animation, zero JS stutter */}
        <path
          id="cny-arc-path"
          d="M 50 250 Q 500 -80 950 250"
          fill="none"
          stroke="#f0c060"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeOpacity={0.7}
        />

        {/* 5 Highlight nodes — appear AFTER arc completes */}
        {HIGHLIGHTS.map((h, i) => (
          <motion.g
            key={h.label}
            whileHover="hover"
            style={
              { originX: `${h.x}px`, originY: `${h.y}px` } as React.CSSProperties
            }
          >
            {/* Golden dot */}
            <motion.circle
              cx={h.x}
              cy={h.y}
              r={4.5}
              fill="#f0c060"
              initial={{ opacity: 0, scale: 0 }}
              animate={
                nodesVisible
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0 }
              }
              transition={{
                delay: (i * NODE_STAGGER) / 1000,
                duration: 0.35,
                type: "spring",
                stiffness: 400,
              }}
              style={{
                filter: "drop-shadow(0 0 6px rgba(240,192,96,0.6))",
              }}
            />

            {/* Invisible hit target */}
            <circle
              cx={h.x}
              cy={h.y}
              r={24}
              fill="transparent"
              className="cursor-pointer"
            />

            {/* Label */}
            <motion.text
              x={h.x}
              y={h.y + 22}
              textAnchor="middle"
              fill="#fef5e7"
              fontSize={13}
              fontWeight={600}
              style={{
                fontFamily: "system-ui, sans-serif",
                filter: "drop-shadow(0 0 6px rgba(240,192,96,0.4))",
              }}
              initial={{ opacity: 0 }}
              animate={
                nodesVisible
                  ? {
                      opacity: 1,
                      fill: [
                        "#fef5e7",
                        "#ffd54f",
                        "#fef5e7",
                        "#ffd54f",
                        "#fef5e7",
                      ],
                    }
                  : { opacity: 0 }
              }
              transition={{
                opacity: {
                  delay: (i * NODE_STAGGER) / 1000,
                  duration: 0.35,
                  ease: "easeOut",
                },
                fill: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: (i * NODE_STAGGER + 400) / 1000,
                },
              }}
              variants={{
                hover: {
                  scale: 1.15,
                  fill: "#ffd54f",
                  filter:
                    "drop-shadow(0 0 12px rgba(240,192,96,0.9))",
                  transition: { duration: 0.25, ease: "easeOut" },
                },
              }}
            >
              {h.label}
            </motion.text>
          </motion.g>
        ))}

        {/* Mascot — GPU layer for smooth animation, no ghosting */}
        <motion.image
          href="/projects/cny-2025/表情包.png"
          width={MASCOT_SIZE}
          height={MASCOT_SIZE}
          initial={{ opacity: 0 }}
          animate={mascotControls}
          style={{
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        />
      </svg>

      {/* ================================================================
          Gift Boxes — Phase 1
          ================================================================ */}
      <motion.div
        className="relative z-10 -mt-20 flex items-end gap-4 sm:-mt-28"
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
      >
        <motion.img
          src="/projects/cny-2025/礼盒A.png"
          alt=""
          className="w-[110px] sm:w-[150px]"
          style={{
            filter:
              "drop-shadow(0 0 10px rgba(240,192,96,0.35)) drop-shadow(0 4px 12px rgba(0,0,0,0.3))",
          }}
          initial={{ scale: 0, y: 60, rotate: -6 }}
          animate={
            phase >= 1
              ? { scale: 1, y: [0, -10, 0], rotate: -3 }
              : { scale: 0, y: 60, rotate: -6 }
          }
          transition={
            phase >= 1
              ? {
                  scale: {
                    duration: 0.8,
                    ease: [0.34, 1.56, 0.64, 1],
                    delay: 0.15,
                  },
                  y: {
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.95,
                  },
                  rotate: { duration: 0.8, delay: 0.15 },
                }
              : {}
          }
        />

        <motion.img
          src="/projects/cny-2025/礼盒B.png"
          alt=""
          className="w-[130px] sm:w-[180px]"
          style={{
            filter:
              "drop-shadow(0 0 10px rgba(240,192,96,0.35)) drop-shadow(0 4px 12px rgba(0,0,0,0.3))",
          }}
          initial={{ scale: 0, y: 60, rotate: 6 }}
          animate={
            phase >= 1
              ? { scale: 1, y: [0, -14, 0], rotate: 3 }
              : { scale: 0, y: 60, rotate: 6 }
          }
          transition={
            phase >= 1
              ? {
                  scale: {
                    duration: 0.8,
                    ease: [0.34, 1.56, 0.64, 1],
                    delay: 0.25,
                  },
                  y: {
                    duration: 3.0,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.05,
                  },
                  rotate: { duration: 0.8, delay: 0.25 },
                }
              : {}
          }
        />
      </motion.div>

      {/* ================================================================
          Title Block — Phase 3
          ================================================================ */}
      <motion.div
        className="absolute bottom-[13%] z-10 flex flex-col items-center px-6 text-center"
        initial={{ opacity: 0 }}
        animate={{
          opacity: phase === 3 ? 1 : 0,
          pointerEvents: phase === 3 ? "auto" : "none",
        }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="font-display text-[clamp(40px,7vw,64px)] font-semibold leading-[1.08] tracking-wide text-[#fef5e7]"
          animate={{
            opacity: phase === 3 ? 1 : 0,
            y: phase === 3 ? 0 : 20,
          }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          有仔有福
        </motion.h1>

        <motion.p
          className="mt-1.5 text-[16px] tracking-wider text-[#fef5e7]/75"
          animate={{
            opacity: phase === 3 ? 1 : 0,
            y: phase === 3 ? 0 : 20,
          }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
        >
          2025 新春礼盒整合营销
        </motion.p>

        <motion.div
          className="mt-2.5 flex flex-wrap justify-center gap-x-6 gap-y-1 text-[13px] tracking-wide text-[#f0c060]/70"
          animate={{
            opacity: phase === 3 ? 1 : 0,
            y: phase === 3 ? 0 : 20,
          }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
        >
          <span>三阶段递进</span>
          <span>全网曝光 536 万+</span>
          <span>礼盒售出 10,000 套</span>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator — fades in with phase 3, smaller & lower */}
      <motion.div
        className="absolute bottom-0 z-10 scale-75"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 3 ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <ScrollIndicator targetId="content-start" hoverBg="#f0c060" />
      </motion.div>

      {/* Gradient transition */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: `linear-gradient(to bottom, transparent, rgba(200,90,70,0.45), #d47358)`,
        }}
      />
    </section>
  );
}
