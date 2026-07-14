"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useAnimationControls,
  useInView,
} from "framer-motion";

/* ================================================================
   RouteMap — Polygon China outline + 4-city tour route
   + IP mascot walking the dotted line

   Tour order: 郑州 → 厦门 → 天津 → 青岛
   ================================================================ */

type LabelAlign = "left" | "right" | "top";

interface City {
  name: string;
  date: string;
  university: string;
  x: number;
  y: number;
  labelAlign: LabelAlign;
}

const CITIES: City[] = [
  {
    name: "郑州",
    date: "4月10日 – 4月11日",
    university: "郑州大学体育学院",
    x: 240,
    y: 185,
    labelAlign: "left",
  },
  {
    name: "厦门",
    date: "4月23日 – 4月24日",
    university: "华侨大学厦门校区",
    x: 328,
    y: 285,
    labelAlign: "right",
  },
  {
    name: "天津",
    date: "5月13日 – 5月14日",
    university: "天津中医药大学",
    x: 355,
    y: 125,
    labelAlign: "left",
  },
  {
    name: "青岛",
    date: "5月15日 – 5月16日",
    university: "青岛大学金家岭校区",
    x: 390,
    y: 178,
    labelAlign: "right",
  },
];

/* ================================================================
   Simplified rooster silhouette — traced from kv2 yellow landmass

   NOT a geographic map. No provinces, no administrative borders.
   An organic, cream-coloured island/platform in game-map style.
   Counterclockwise from beak (right). Smooth bezier curves.
   ================================================================ */

const CHINA_OUTLINE = [
  // ── BEAK ──
  "M 418 82",
  // ── HEAD top ──
  "C 408 68, 396 56, 382 53",
  // ── COMB (3 petal bumps) ──
  "C 374 44, 365 52, 358 48",
  "C 348 42, 342 52, 334 47",
  "C 324 41, 318 51, 310 47",
  // ── BACK OF NECK ──
  "C 296 52, 282 49, 268 51",
  // ── UPPER BACK — 4 petal scallops ──
  "C 258 55, 252 44, 242 50",
  "C 232 55, 226 44, 216 51",
  "C 206 58, 198 46, 188 54",
  "C 178 62, 168 50, 158 58",
  // ── MID BACK — 4 petal scallops ──
  "C 146 66, 138 54, 128 62",
  "C 118 70, 110 58, 100 68",
  "C 92 78, 86 68, 80 78",
  "C 75 88, 72 80, 68 90",
  // ── RUMP → TAIL (2 pointed bumps) ──
  "C 68 106, 75 112, 72 122",
  "C 68 136, 76 142, 74 152",
  "C 72 164, 80 168, 82 178",
  // ── UNDER-TAIL — 2 scallops ──
  "C 86 192, 94 186, 98 196",
  "C 104 210, 112 204, 118 216",
  // ── BELLY — 5 petal scallops ──
  "C 126 230, 134 224, 140 236",
  "C 148 250, 158 244, 164 258",
  "C 174 272, 184 266, 190 280",
  "C 200 294, 212 286, 220 300",
  "C 232 314, 244 306, 254 318",
  // ── BELLY FRONT → LOWER CHEST ──
  "C 268 330, 286 336, 306 334",
  "C 328 330, 348 324, 366 312",
  // ── CHEST — 2 petal bumps ──
  "C 376 304, 370 294, 382 286",
  "C 392 276, 400 270, 404 260",
  "C 408 248, 412 240, 410 230",
  "C 407 220, 404 214, 400 208",
  // ── NECK indent ──
  "C 394 198, 388 186, 382 176",
  // ── THROAT → JAW ──
  "C 376 166, 372 152, 374 140",
  "C 376 128, 382 116, 390 106",
  // ── WATTLE → UNDER-BEAK ──
  "C 396 98, 406 92, 414 87",
  "C 420 84, 419 83, 418 82",
  "Z",
].join(" ");

// Hainan — small blob below, kv2 style
const HAINAN =
  "M 220 348 C 214 342, 208 348, 210 356 C 212 364, 222 366, 228 360 C 232 354, 228 350, 220 348 Z";

// Taiwan — leaf-shaped blob, kv2 style
const TAIWAN =
  "M 358 305 C 352 298, 348 306, 350 316 C 353 326, 362 328, 368 320 C 372 312, 366 308, 358 305 Z";

// ================================================================
// Color palette (KV-inspired)
// ================================================================
const OCEAN_GRADIENT_ID = "oceanGradient";
const MAP_FILL = "#f8f2e3";
const MAP_STROKE = "#ddcfb0";
const ROUTE_DOT_COLOR = "#e87850";
const PIN_RED = "#d94838";
const PIN_WHITE = "#ffffff";
const MASCOT_SIZE = 68;

/* ================================================================
   Sub-components
   ================================================================ */

function Pushpin({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <ellipse cx="0" cy="16" rx="5" ry="2.5" fill="#00000010" />
      <path
        d="M0,-14 C-6.2,-14 -10.5,-8.8 -10.5,-2.5 C-10.5,4 -3,11.5 0,16 C3,11.5 10.5,4 10.5,-2.5 C10.5,-8.8 6.2,-14 0,-14 Z"
        fill={PIN_RED}
      />
      <circle cx="0" cy="-4.5" r="4" fill={PIN_WHITE} opacity="0.9" />
      <ellipse cx="-2.5" cy="-8.5" rx="2.8" ry="1.8" fill="#fff" opacity="0.22" />
    </g>
  );
}

function Cloud({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`} opacity="0.45">
      <ellipse cx="0" cy="0" rx="15" ry="9" fill="#fff" />
      <circle cx="-12" cy="3" r="7" fill="#fff" />
      <circle cx="12" cy="3" r="7" fill="#fff" />
      <circle cx="-5" cy="-6" r="9" fill="#fff" />
      <circle cx="5" cy="-6" r="9" fill="#fff" />
    </g>
  );
}

function CompassRose({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx}, ${cy})`} opacity="0.3">
      <circle cx="0" cy="0" r="16" fill="none" stroke={MAP_STROKE} strokeWidth="1" strokeDasharray="2 2" />
      <polygon points="0,-13 -3,1 0,-3 3,1" fill="#d47555" />
      <polygon points="0,13 -3,-1 0,3 3,-1" fill="#c8b898" />
      <polygon points="13,0 -1,-3 3,0 -1,3" fill="#c8b898" />
      <polygon points="-13,0 1,-3 -3,0 1,3" fill="#c8b898" />
      <circle cx="0" cy="0" r="2" fill={MAP_STROKE} />
      <text x="0" y="-19" textAnchor="middle" fill="#d47555" style={{ fontSize: "8px", fontWeight: 700 }}>N</text>
    </g>
  );
}

function Sparkle({ cx, cy, size = 1 }: { cx: number; cy: number; size?: number }) {
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${size})`} opacity="0.55">
      <path d="M0,-6 L1.5,-1.5 L6,0 L1.5,1.5 L0,6 L-1.5,1.5 L-6,0 L-1.5,-1.5 Z" fill="#e8c878" />
    </g>
  );
}

function Starfish({ cx, cy, size = 1 }: { cx: number; cy: number; size?: number }) {
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${size})`} opacity="0.55">
      <path
        d="M0,-10 L2,-2.5 L10,-2.5 L3.5,2 L6,10 L0,5.5 L-6,10 L-3.5,2 L-10,-2.5 L-2,-2.5 Z"
        fill="#e8b878"
        stroke="#d4a060"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    </g>
  );
}

function Shell({ cx, cy, size = 1 }: { cx: number; cy: number; size?: number }) {
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${size})`} opacity="0.55">
      {/* Scallop body */}
      <path
        d="M0,6 C-10,2 -12,-6 -6,-12 C0,-7 6,-12 12,-6 C12,2 6,6 0,6 Z"
        fill="#f0d8c0"
        stroke="#d4b898"
        strokeWidth="0.6"
      />
      {/* Ridges */}
      <line x1="0" y1="6" x2="-4" y2="-8" stroke="#d4b898" strokeWidth="0.5" />
      <line x1="0" y1="6" x2="0" y2="-10" stroke="#d4b898" strokeWidth="0.5" />
      <line x1="0" y1="6" x2="4" y2="-8" stroke="#d4b898" strokeWidth="0.5" />
    </g>
  );
}

/* ================================================================
   WalkingMascot — animated IP that walks the route on loop

   Image: /projects/campus-tour/mascot.png
   Route: 郑州 → 厦门 → 天津 → 青岛 (loop, no return leg)
   ================================================================ */

const MASCOT_ROUTE = {
  x: [
    CITIES[0].x - MASCOT_SIZE / 2, // 郑州
    CITIES[1].x - MASCOT_SIZE / 2, // 厦门
    CITIES[2].x - MASCOT_SIZE / 2, // 天津
    CITIES[3].x - MASCOT_SIZE / 2, // 青岛
  ],
  y: [
    CITIES[0].y - MASCOT_SIZE / 2, // centred on pin
    CITIES[1].y - MASCOT_SIZE / 2,
    CITIES[2].y - MASCOT_SIZE / 2,
    CITIES[3].y - MASCOT_SIZE / 2,
  ],
};

const MASCOT_TIMES = [0, 0.33, 0.66, 1];

function WalkingMascot() {
  const controls = useAnimationControls();
  const ref = useRef<SVGImageElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    // Single start: x/y + opacity both delay 2.0s, after all city animations finish
    controls.start({
      x: MASCOT_ROUTE.x,
      y: MASCOT_ROUTE.y,
      opacity: 1,
      transition: {
        x: {
          delay: 2.0,
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          times: MASCOT_TIMES,
          repeatDelay: 1.8,
        },
        y: {
          delay: 2.0,
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          times: MASCOT_TIMES,
          repeatDelay: 1.8,
        },
        opacity: { delay: 2.0, duration: 0.4 },
      },
    });
  }, [inView, controls]);

  return (
    <motion.image
      ref={ref}
      href="/projects/campus-tour/mascot.png"
      width={MASCOT_SIZE}
      height={MASCOT_SIZE}
      initial={{ x: MASCOT_ROUTE.x[0], y: MASCOT_ROUTE.y[0], opacity: 0 }}
      animate={controls}
      style={{
        filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.18))",
        transform: "scaleX(-1)",
        transformOrigin: "center center",
      }}
    />
  );
}

/* ================================================================
   Main
   ================================================================ */
export function RouteMap() {
  const routePoints = CITIES.map((c) => `${c.x},${c.y}`).join(" ");

  const getLabelProps = (city: City) => {
    switch (city.labelAlign) {
      case "left":
        return {
          textAnchor: "end" as const,
          dx: -24,
          nameY: city.y - 18,
          dateY: city.y - 4,
          uniY: city.y + 8,
          badgeX: city.x - 18,
          badgeY: city.y - 22,
        };
      case "right":
        return {
          textAnchor: "start" as const,
          dx: 24,
          nameY: city.y - 18,
          dateY: city.y - 4,
          uniY: city.y + 8,
          badgeX: city.x + 18,
          badgeY: city.y - 22,
        };
      case "top":
        return {
          textAnchor: "middle" as const,
          dx: 0,
          nameY: city.y - 34,
          dateY: city.y - 22,
          uniY: city.y - 10,
          badgeX: city.x + 16,
          badgeY: city.y - 26,
        };
    }
  };

  return (
    <div className="flex items-start justify-center gap-5 sm:gap-8">
      {/* ================================================================
          Legend — LEFT side, vertical stack
          ================================================================ */}
      <motion.div
        className="mt-16 flex shrink-0 flex-col items-center gap-10 pl-2"
        initial={{ opacity: 0, x: -14 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {/* 活动城市 */}
        <div className="flex flex-col items-center gap-2">
          <svg width="16" height="20" viewBox="0 0 14 18">
            <path
              d="M7,1 C3.5,1 1,3.8 1,7 C1,12.2 5.5,16 7,17.5 C8.5,16 13,12.2 13,7 C13,3.8 10.5,1 7,1 Z"
              fill="#d94838"
            />
            <circle cx="7" cy="5.5" r="3" fill="#fff" opacity="0.9" />
          </svg>
          <span className="text-[11px] tracking-wide text-text-tertiary">
            活动城市
          </span>
        </div>

        {/* 巡回路线 */}
        <div className="flex flex-col items-center gap-2">
          <svg width="10" height="36" viewBox="0 0 10 36">
            <circle cx="5" cy="4" r="3.8" fill="#e87850" opacity="0.85" />
            <circle cx="5" cy="13" r="3.8" fill="#e87850" opacity="0.85" />
            <circle cx="5" cy="22" r="3.8" fill="#e87850" opacity="0.85" />
            <circle cx="5" cy="31" r="3.8" fill="#e87850" opacity="0.85" />
          </svg>
          <span className="text-[11px] tracking-wide text-text-tertiary">
            巡回路线
          </span>
        </div>
      </motion.div>

      {/* ================================================================
          Map SVG — wide viewBox, ocean panel with generous left margin
          ================================================================ */}
      <motion.svg
        viewBox="0 0 620 480"
        className="w-full max-w-[600px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={OCEAN_GRADIENT_ID} cx="45%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#dceee8" />
            <stop offset="60%" stopColor="#c6e2db" />
            <stop offset="100%" stopColor="#aed5cc" />
          </radialGradient>
        </defs>

        {/* Ocean background panel — generous padding on all sides */}
        <motion.rect
          x="14" y="8" width="594" height="440" rx="28"
          fill={`url(#${OCEAN_GRADIENT_ID})`}
          stroke="#b8d2cb" strokeWidth="1.5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />

        {/* Wave decorations — widened for larger panel */}
        <g opacity="0.35">
          <path d="M34,370 Q104,360 174,370 Q244,380 314,370 Q384,360 454,370 Q524,380 594,370" fill="none" stroke="#94c0b6" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M44,384 Q114,374 184,384 Q254,394 324,384 Q394,374 464,384 Q534,394 604,384" fill="none" stroke="#94c0b6" strokeWidth="1" strokeLinecap="round" />
          <path d="M54,396 Q124,386 194,396 Q264,406 334,396 Q404,386 474,396 Q544,406 614,396" fill="none" stroke="#94c0b6" strokeWidth="0.8" strokeLinecap="round" />
        </g>

        {/* ---- Detailed China outline (polygon) ---- */}
        <motion.path
          d={CHINA_OUTLINE}
          fill={MAP_FILL}
          stroke={MAP_STROKE}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Hainan */}
        <motion.path
          d={HAINAN}
          fill={MAP_FILL}
          stroke={MAP_STROKE}
          strokeWidth="1.4"
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        />

        {/* Taiwan */}
        <motion.path
          d={TAIWAN}
          fill={MAP_FILL}
          stroke={MAP_STROKE}
          strokeWidth="1.4"
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        />

        {/* ---- Route dotted line ---- */}
        <motion.polyline
          points={routePoints}
          stroke={ROUTE_DOT_COLOR}
          strokeWidth="5.5"
          strokeDasharray="0 11"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.88 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* ---- City markers ---- */}
        {CITIES.map((city, i) => {
          const lp = getLabelProps(city);

          return (
            <g key={city.name}>
              {/* Pushpin — bounce in */}
              <motion.g
                initial={{ opacity: 0, scale: 0, y: -10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.55,
                  delay: 1.0 + i * 0.16,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
              >
                <Pushpin cx={city.x} cy={city.y} />
              </motion.g>

              {/* Sequence badge */}
              <motion.g
                transform={`translate(${lp.badgeX}, ${lp.badgeY})`}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 1.4 + i * 0.12, ease: "easeOut" }}
              >
                <circle cx="0" cy="0" r="9" fill={ROUTE_DOT_COLOR} opacity="0.92" />
                <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fill="#fff"
                  style={{ fontSize: "10px", fontWeight: 700 }}>
                  {i + 1}
                </text>
              </motion.g>

              {/* Label block */}
              <motion.g
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 1.3 + i * 0.15, ease: "easeOut" }}
              >
                <text x={city.x + lp.dx} y={lp.nameY} textAnchor={lp.textAnchor}
                  className="fill-text-primary"
                  style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.04em" }}>
                  {city.name}
                </text>
                <text x={city.x + lp.dx} y={lp.dateY} textAnchor={lp.textAnchor}
                  className="fill-text-secondary"
                  style={{ fontSize: "10px", fontWeight: 500 }}>
                  {city.date}
                </text>
                <text x={city.x + lp.dx} y={lp.uniY} textAnchor={lp.textAnchor}
                  className="fill-text-tertiary"
                  style={{ fontSize: "10px", fontWeight: 400 }}>
                  {city.university}
                </text>
              </motion.g>
            </g>
          );
        })}

        {/* ---- Walking mascot — rendered AFTER city markers so it sits on top ---- */}
        <WalkingMascot />

        {/* ---- Decorations ---- */}
        <Cloud cx={170} cy={78} scale={0.8} />
        <Cloud cx={470} cy={60} scale={0.6} />
        <Cloud cx={95} cy={148} scale={0.5} />

        <CompassRose cx={80} cy={420} />

        {/* Sea-life decorations */}
        <Starfish cx={150} cy={380} size={0.8} />
        <Starfish cx={480} cy={370} size={0.65} />
        <Shell cx={440} cy={395} size={0.75} />
        <Shell cx={120} cy={340} size={0.6} />

        <Sparkle cx={175} cy={175} />
        <Sparkle cx={510} cy={245} size={0.8} />
        <Sparkle cx={190} cy={315} size={0.7} />
      </motion.svg>
    </div>
  );
}
