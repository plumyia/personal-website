"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { FeatherTrail } from "./FeatherTrail";

interface LoadingScreenProps {
  onComplete: () => void;
}

// ── Single continuous path: flight → sweep (seamless) ────────────
function generateFullPath() {
  const FLIGHT_PTS = 32;
  const SWEEP_PTS = 24;

  const xArr: string[] = [];
  const yArr: string[] = [];
  const rArr: number[] = [];

  // ── Segment 1: damped-sine flight, top-left → centre-left ──────
  const fsx = -38,
    fex = -10,
    fsy = -48,
    fey = 2,
    fsr = -35,
    fer = -20;

  for (let i = 0; i < FLIGHT_PTS; i++) {
    const t = i / (FLIGHT_PTS - 1);
    const ye = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const damp = Math.sin(t * Math.PI) * 0.7;
    const wave = Math.sin(t * Math.PI * 2.6 + 0.4) * 13 * damp;
    xArr.push(`${(fsx + (fex - fsx) * t + wave).toFixed(1)}vw`);
    yArr.push(`${(fsy + (fey - fsy) * ye).toFixed(1)}vh`);
    rArr.push(Number((fsr * (1 - t) + wave * 0.4).toFixed(1)));
  }

  // ── Segment 2: gentle rightward sweep through the name ─────────
  const ssx = -10,
    sex = 16,
    ssy = 2,
    sey = 3,
    ssr = -20,
    ser = 10;

  for (let i = 1; i < SWEEP_PTS; i++) {
    const t = i / (SWEEP_PTS - 1);
    const xe = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const arc = Math.sin(t * Math.PI * 0.65) * 5;
    xArr.push(`${(ssx + (sex - ssx) * xe).toFixed(1)}vw`);
    yArr.push(`${(ssy + (sey - ssy) * t - arc).toFixed(1)}vh`);
    rArr.push(
      Number((ssr + (ser - ssr) * t + Math.sin(t * Math.PI) * 4).toFixed(1)),
    );
  }

  return { x: xArr, y: yArr, r: rArr };
}

const fullPath = generateFullPath();
const totalDuration = 5.0;

// ── Shared ───────────────────────────────────────────────────────
const TRAIL_DELAYS = [0.08, 0.18, 0.28, 0.38];
const OPACITY_KEYFRAMES = [0, 0.7, 0.5, 0.2, 0];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [revealStep, setRevealStep] = useState(0); // 1=徐 2=羽 3=佳 4=PORTFOLIO
  const exitingRef = useRef(false);
  const exitTriggeredRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const nameChars = useMemo(() => [..."徐羽佳"], []);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // ── Left-to-right reveal synced with feather sweep ──────────────
  useEffect(() => {
    const timers = [
      setTimeout(() => setRevealStep(1), 3350), // 徐 — feather entering centre
      setTimeout(() => setRevealStep(2), 3700), // 羽 — feather at centre
      setTimeout(() => setRevealStep(3), 4050), // 佳 — feather passing right
      setTimeout(() => setRevealStep(4), 4300), // PORTFOLIO
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const triggerExit = () => {
    if (exitTriggeredRef.current) return;
    exitTriggeredRef.current = true;
    exitingRef.current = true;
    setIsExiting(true);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-bg-primary"
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (exitingRef.current) onCompleteRef.current();
      }}
    >
      {/* ============================================================
          Background: subtle diagonal gradient + grain
          ============================================================ */}

      {/* Diagonal three-colour gradient — softer */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(135deg, rgba(245,238,228,0.5) 0%, #fefaf3 35%, rgba(200,151,94,0.05) 55%, #fefaf3 75%, rgba(218,208,190,0.3) 100%)",
        }}
      />

      {/* Grain texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ============================================================
          Background Glow
          ============================================================ */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: 360, height: 360 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.6, ease: "easeOut" }}
        aria-hidden="true"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(200,151,94,0.16) 0%, rgba(200,151,94,0.04) 40%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* ============================================================
          Grid stack: Name (behind) + Trail + Feather (on top)
          Feather sweeps left→right, name appears in sync
          ============================================================ */}
      <div className="grid place-items-center">
        {/* Name + subtitle — centred, behind feather, left-to-right reveal */}
        <div className="z-0 flex flex-col items-center gap-1 [grid-area:1/1]">
          <h1 className="font-display text-[48px] font-semibold tracking-wide text-text-primary">
            {nameChars.map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: 4 }}
                animate={{
                  opacity: revealStep > i ? 1 : 0,
                  y: revealStep > i ? 0 : 4,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {char}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: revealStep >= 4 ? 1 : 0 }}
            transition={{ duration: 0.45 }}
            className="text-[16px] uppercase tracking-[0.25em] text-text-secondary"
          >
            PORTFOLIO
          </motion.p>
        </div>

        {/* Trail particles — top-LEFT, more distance from feather */}
        {TRAIL_DELAYS.map((delay, i) => (
          <motion.div
            key={i}
            className="pointer-events-none z-[1] rounded-full bg-accent/35 [grid-area:1/1]"
            style={{
              width: 4 + i * 1.5,
              height: 4 + i * 1.5,
              marginLeft: -110 - i * 45,
              marginTop: -200 - i * 38,
            }}
            initial={{
              x: fullPath.x[0],
              y: fullPath.y[0],
              rotate: fullPath.r[0],
              opacity: 0,
            }}
            animate={{
              x: fullPath.x,
              y: fullPath.y,
              rotate: fullPath.r,
              opacity: OPACITY_KEYFRAMES,
            }}
            transition={{
              duration: totalDuration,
              ease: "linear",
              delay,
            }}
            aria-hidden="true"
          />
        ))}

        {/* Feather — sweeps left→right in one continuous motion */}
        <motion.div
          className="z-10 [grid-area:1/1]"
          initial={{
            x: fullPath.x[0],
            y: fullPath.y[0],
            rotate: fullPath.r[0],
            opacity: 0,
          }}
          animate={{
            x: fullPath.x,
            y: fullPath.y,
            rotate: fullPath.r,
            opacity: 1,
          }}
          transition={{
            duration: totalDuration,
            ease: "linear",
            opacity: { duration: 0.5 },
          }}
        >
          <FeatherTrail variant="full" />
        </motion.div>
      </div>

      {/* ============================================================
          Top loading bar
          ============================================================ */}
      <div
        className="pointer-events-none absolute left-8 right-8 top-10"
        aria-hidden="true"
      >
        <div className="h-[1.5px] overflow-hidden rounded-full bg-border/50">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              delay: 0.8,
              duration: 4.5,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{ transformOrigin: "left" }}
          />
        </div>
      </div>

      {/* ============================================================
          Bottom loading bar
          ============================================================ */}
      <div
        className="pointer-events-none absolute left-8 right-8 bottom-10"
        aria-hidden="true"
      >
        <div className="h-[1.5px] overflow-hidden rounded-full bg-border/50">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              delay: 0.8,
              duration: 4.5,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{ transformOrigin: "left" }}
            onAnimationComplete={triggerExit}
          />
        </div>
      </div>
    </motion.div>
  );
}
