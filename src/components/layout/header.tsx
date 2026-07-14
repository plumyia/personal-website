"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FeatherTrail } from "@/components/loading/FeatherTrail";

const NAV_ITEMS = [
  { label: "Home", labelCN: "首页", href: "/" },
  { label: "Project", labelCN: "项目", href: "/work" },
  { label: "Brand", labelCN: "品牌", href: "/brands" },
  { label: "About", labelCN: "关于", href: "/about" },
];

/* ---- Sample actual background color behind header ---- */

/** Parse a CSS color string (hex, rgb, or var()) into [r,g,b] using the element for var resolution. */
function parseColor(colorStr: string, el: Element): [number, number, number] | null {
  // Resolve CSS custom properties
  let c = colorStr.trim();
  if (c.startsWith("var(")) {
    const varName = c.slice(4, -1).trim();
    c = getComputedStyle(el).getPropertyValue(varName).trim() || "#fefaf3";
  }
  // hex
  if (c.startsWith("#")) {
    const h = c.slice(1);
    if (h.length === 3) {
      return [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)];
    }
    if (h.length >= 6) {
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    }
  }
  // rgb / rgba
  const m = c.match(/[\d.]+/g);
  if (m && m.length >= 3) {
    return [parseFloat(m[0]), parseFloat(m[1]), parseFloat(m[2])];
  }
  return null;
}

/** Compute perceived luminance 0-1 (lower = darker). */
function luminance(rgb: [number, number, number]): number {
  return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
}

/** Split a string by top-level commas (ignoring commas inside parens). */
function splitTopLevel(s: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of s) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      parts.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

/** Parse linear-gradient and return the interpolated [r,g,b] at a given y within the element, or null. */
function sampleGradientAt(el: Element, y: number): [number, number, number] | null {
  const bgImage = getComputedStyle(el).backgroundImage;
  if (!bgImage || bgImage === "none") return null;

  // Extract content inside linear-gradient(…) — handle nested parens
  const prefix = "linear-gradient(";
  const idx = bgImage.indexOf(prefix);
  if (idx === -1) return null;

  let depth = 0;
  let end = -1;
  for (let i = idx + prefix.length; i < bgImage.length; i++) {
    if (bgImage[i] === "(") depth++;
    else if (bgImage[i] === ")") {
      if (depth === 0) { end = i; break; }
      depth--;
    }
  }
  if (end === -1) return null;

  const inner = bgImage.slice(idx + prefix.length, end);
  const parts = splitTopLevel(inner);
  if (parts.length < 2) return null;

  // First part may be a direction keyword/angle — skip it if it doesn't look like a color
  const looksLikeColor = /^(#|rgb|rgba|hsl|var)/.test(parts[0]);
  const stopsRaw = looksLikeColor ? parts : parts.slice(1);

  // Parse color stops
  const stops: { rgb: [number, number, number]; pct: number }[] = [];

  for (const raw of stopsRaw) {
    // Split "color pct%" — color may be rgb(r,g,b) or #hex
    const m = raw.match(/^(.+?)\s+([\d.]+%)\s*$/);
    let colorStr: string;
    let pctStr = "";
    if (m) {
      colorStr = m[1];
      pctStr = m[2];
    } else {
      // No percentage — just a color
      colorStr = raw;
    }

    const rgb = parseColor(colorStr, el);
    if (!rgb) continue;

    let pct = 0;
    if (pctStr.endsWith("%")) {
      pct = parseFloat(pctStr) / 100;
    } else {
      pct = stops.length > 0 ? stops[stops.length - 1].pct : 0;
    }

    stops.push({ rgb, pct });
  }

  if (stops.length < 2) return null;

  // Where is y within this element? (0 = top, 1 = bottom)
  const rect = el.getBoundingClientRect();
  if (rect.height <= 0) return null;
  const t = Math.max(0, Math.min(1, (y - rect.top) / rect.height));

  // Find surrounding stops and interpolate
  let lo = stops[0];
  let hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i].pct && t <= stops[i + 1].pct) {
      lo = stops[i];
      hi = stops[i + 1];
      break;
    }
  }

  const range = hi.pct - lo.pct;
  const frac = range === 0 ? 0 : (t - lo.pct) / range;

  return [
    Math.round(lo.rgb[0] + (hi.rgb[0] - lo.rgb[0]) * frac),
    Math.round(lo.rgb[1] + (hi.rgb[1] - lo.rgb[1]) * frac),
    Math.round(lo.rgb[2] + (hi.rgb[2] - lo.rgb[2]) * frac),
  ];
}

function isOverDarkBackground(): boolean {
  const y = 40; // middle of header
  const els = document.elementsFromPoint(window.innerWidth / 2, y);
  for (const el of els) {
    if (el.closest("header")) continue;

    // Sections marked with data-nav="keep-dark-text" keep nav text dark
    if (el.closest("[data-nav='keep-dark-text']")) return false;
    // Sections marked with data-nav="keep-light-text" keep nav text light
    if (el.closest("[data-nav='keep-light-text']")) return true;

    const tag = el.tagName.toLowerCase();
    // Media / canvas / SVG → hero area, treat as dark bg
    if (tag === "img" || tag === "video" || tag === "canvas" || tag === "svg") {
      return true;
    }

    // 1) Check background-color (solid colour)
    const bg = getComputedStyle(el).backgroundColor;
    const rgb = parseColor(bg, el);
    if (rgb) {
      const alpha = bg.match(/[\d.]+/g);
      const a = alpha && alpha.length === 4 ? parseFloat(alpha[3]) : 1;
      if (a >= 0.1) return luminance(rgb) < 0.6;
    }

    // 2) Check background-image gradient — compute actual colour at header position
    const gradRgb = sampleGradientAt(el, y);
    if (gradRgb) return luminance(gradRgb) < 0.6;
  }
  return false; // default: light background
}

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isProjectDetail =
    pathname.startsWith("/projects/") && pathname !== "/projects";
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);

  useEffect(() => {
    let ticking = false;
    let debounceId: ReturnType<typeof setTimeout> | null = null;
    let lastCommitted: boolean | null = null;

    const commit = (val: boolean) => {
      if (lastCommitted !== val) {
        if (debounceId) clearTimeout(debounceId);
        debounceId = setTimeout(() => {
          setOverDark(val);
          lastCommitted = val;
        }, 120);
      }
    };

    const update = () => {
      setScrolled(window.scrollY > 60);
      if (isProjectDetail || isHome) {
        const dark = isOverDarkBackground();
        if (lastCommitted === null) {
          // First sample after mount / route change — apply immediately
          setOverDark(dark);
          lastCommitted = dark;
        } else {
          commit(dark);
        }
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update(); // initialize on mount
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (debounceId) clearTimeout(debounceId);
    };
  }, [isProjectDetail, isHome]);

  // Text color:
  // - Homepage & project detail → adaptive (light over dark images, dark over light bg)
  // - Other pages → always dark
  const isDarkText = (isProjectDetail || isHome) ? !overDark : true;

  const cnClass = `text-[13px] font-medium tracking-wide transition-colors duration-300 ${isDarkText ? "text-[#3d2e20]" : "text-[#fefaf3]"
    }`;
  const enClass = `text-[10px] font-normal uppercase tracking-[0.15em] transition-colors duration-300 ${isDarkText ? "text-[#8b7355]" : "text-[#f0c060]/70"
    }`;

  const isHomeAnchor = (href: string) => href.startsWith("/#");

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-transparent"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 sm:px-8">
        {/* Brand — name + feather, top-left */}
        <Link
          href="/"
          className={`ml-5 flex items-center gap-0.5 transition-opacity duration-300 hover:opacity-70 ${isDarkText ? "text-text-primary" : "text-[#fefaf3]"
            }`}
        >
          <span className="font-display text-[19px] font-semibold tracking-wide">
            徐羽佳
          </span>
          <FeatherTrail variant="small" className="mt-3" />
        </Link>

        <nav className="flex items-center gap-10">
          {NAV_ITEMS.map((item) => {
            if (isHomeAnchor(item.href)) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.querySelector(
                      item.href.replace("/", ""),
                    );
                    if (target)
                      target.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group flex flex-col items-center gap-0.5"
                >
                  <span className={cnClass}>{item.labelCN}</span>
                  <span className={enClass}>{item.label}</span>
                </a>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col items-center gap-0.5"
              >
                <span className={cnClass}>{item.labelCN}</span>
                <span className={enClass}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
