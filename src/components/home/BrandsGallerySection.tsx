"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { SectionHeading } from "@/components/shared/section-heading";
import { brandLogos } from "@/lib/data";

type BrandItem = { name: string; src: string; cropBottom?: boolean };

const BRAND_GROUPS: BrandItem[][] = [
  [
    { name: "Bvlgari", src: "/brands/preview/bvlgari-preview.jpg" },
    { name: "Nike", src: "/brands/preview/NIKE-preview.jpg" },
  ],
  [
    { name: "STAYREAL", src: "/brands/preview/STAYREAL-preview.jpg", cropBottom: true },
    { name: "世纪汇广场", src: "/brands/preview/世纪汇广场-preview.jpg", cropBottom: true },
  ],
  [
    { name: "sams", src: "/brands/preview/sams-preview.jpg" },
    { name: "common rare", src: "/brands/preview/common rare-preview.jpg" },
  ],
];

const scrollingLogos = [...brandLogos, ...brandLogos];

function BrandCard({ name, src, cropBottom }: { name: string; src: string; cropBottom?: boolean }) {
  return (
    <motion.div
      className="group relative cursor-none overflow-hidden rounded-lg bg-bg-tertiary"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        className={`block aspect-[3/1] w-full object-cover ${cropBottom ? "object-top" : ""}`}
        loading="eager"
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-border/30 transition-colors group-hover:ring-accent/20" />
    </motion.div>
  );
}

export function BrandsGallerySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  // Preload all brand preview images so hover shows instantly
  useEffect(() => {
    BRAND_GROUPS.flat().forEach((brand) => {
      const img = new Image();
      img.src = brand.src;
      img.decode().then(() => {}).catch(() => {});
    });
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Measure horizontal scroll distance
  useEffect(() => {
    const measure = () => {
      if (trackRef.current && containerRef.current) {
        const trackWidth = trackRef.current.scrollWidth;
        const containerWidth = containerRef.current.offsetWidth;
        const dist = Math.max(0, trackWidth - containerWidth + 200);
        setScrollDistance(dist);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    const imgs = trackRef.current?.querySelectorAll("img");
    imgs?.forEach((img) => img.addEventListener("load", measure));
    return () => {
      window.removeEventListener("resize", measure);
      imgs?.forEach((img) => img.removeEventListener("load", measure));
    };
  }, []);

  // Map vertical scroll to horizontal translation
  const x = useTransform(scrollYProgress, [0, 0.9], [0, -scrollDistance]);
  const springX = useSpring(x, { stiffness: 70, damping: 26, mass: 0.4 });

  return (
    <section id="brands" className="scroll-mt-28 pb-14">
      {/* Section Heading — float-up reveal */}
      <motion.div
        className="mx-auto max-w-5xl px-6 pt-14 sm:px-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <SectionHeading label="brand partners" title="合作品牌" />
      </motion.div>

      {/* Horizontal Scroll Area — sticky: logo + preview + button all together */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: "180vh" }}
      >
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden" data-nav="keep-dark-text">
          {/* Brand Logo Carousel — float-up reveal */}
          <motion.div
            className="logo-carousel relative w-full max-w-[900px] mx-auto overflow-hidden py-2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
          >
            {/* Gradient fades */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-bg-primary to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-r from-transparent to-bg-primary" />

            <div className="logo-scroll-track flex w-max items-center gap-0">
              {scrollingLogos.map((logo, i) => {
                const isXl = logo.slug === "DreamGala" || logo.slug === "bvlgari";
                const isLarge = logo.slug === "大白兔";
                const isMd = logo.slug === "common rare" || logo.slug === "SHANGRILA";
                const heightClass = logo.carouselHeight
                  || (isXl ? "h-36" : isLarge ? "h-24" : isMd ? "h-18" : "h-16");
                const maxWidth = isXl
                  ? "max-w-[320px]"
                  : isLarge
                    ? "max-w-[200px]"
                    : isMd
                      ? "max-w-[160px]"
                      : "max-w-[150px]";

                return (
                  <div
                    key={`${logo.slug}-${i}`}
                    className={`flex ${heightClass} mr-14 shrink-0 items-center justify-center opacity-45 grayscale transition-all duration-300 hover:opacity-90 hover:grayscale-0 hover:scale-110`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/brands/logo/${logo.file}`}
                      alt={logo.name}
                      className={`max-h-full w-auto ${maxWidth} object-contain`}
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Preview Track — float-up reveal */}
          <motion.div
            className="relative flex-1 flex items-center overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          >
            <motion.div
              ref={trackRef}
              style={{ x: springX }}
              className="flex items-center gap-[clamp(28px,5vw,56px)] px-6 sm:px-8"
            >
              {BRAND_GROUPS.map((group, gi) => (
                <div
                  key={gi}
                  className="flex shrink-0 flex-col gap-4"
                  style={{ width: "clamp(280px, 38vw, 500px)" }}
                >
                  {group.map((brand) => (
                    <BrandCard key={brand.name} {...brand} />
                  ))}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* "查看更多品牌" Button */}
          <div className="flex justify-center py-6">
            <Link
              href="/brands"
              className="cursor-hover inline-flex items-center gap-2 rounded-full border border-accent px-5 py-2 text-[13px] font-medium text-accent transition-all duration-300 hover:bg-accent hover:text-white"
            >
              查看更多品牌 &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
