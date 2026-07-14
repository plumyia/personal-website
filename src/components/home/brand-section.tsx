"use client";

import { useRef, useEffect } from "react";
import { brandLogos } from "@/lib/data";
import { SectionHeading } from "@/components/shared/section-heading";

const logos = [...brandLogos, ...brandLogos, ...brandLogos];

export function BrandSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let position = 0;
    const speed = 0.5;
    let rafId: number;

    const animate = () => {
      position -= speed;
      const oneSetWidth = track.scrollWidth / 3;
      if (Math.abs(position) >= oneSetWidth) {
        position += oneSetWidth;
      }
      track.style.transform = `translate3d(${position}px, 0, 0)`;
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section
      id="brand"
      className="mx-auto max-w-5xl scroll-mt-28 px-6 pb-24 sm:px-8" style={{ paddingTop: 0 }}
    >
      <SectionHeading
        label="Brand"
        title="合作品牌"
        subtitle="服务过的品牌伙伴，涵盖运动、美妆、酒店、快消等领域。"
      />

      <div className="relative overflow-hidden py-2" style={{ marginTop: -8 }}>
        {/* Gradient fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg-primary to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-r from-transparent to-bg-primary" />

        {/* Scrolling track — no links, just display */}
        <div
          ref={trackRef}
          className="flex w-max items-center gap-20 will-change-transform"
          style={{ transform: "translate3d(0, 0, 0)" }}
        >
          {logos.map((logo, i) => (
            <div
              key={`${logo.slug}-${i}`}
              className={`flex shrink-0 items-center justify-center opacity-50 grayscale transition-all duration-300 hover:opacity-90 hover:grayscale-0 ${logo.carouselHeight || "h-12"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/brands/logo/${logo.file}`}
                alt={logo.name}
                className={`max-h-full w-auto object-contain ${logo.logoClass || ""}`}
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
