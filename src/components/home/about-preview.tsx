"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { aboutData } from "@/lib/data";
import { SectionHeading } from "@/components/shared/section-heading";

export function AboutPreview() {
  return (
    <section
      id="about"
      className="mx-auto max-w-3xl scroll-mt-28 px-6 py-14 sm:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <SectionHeading
          label="About"
          title="关于我"
          subtitle=""
        />
      </motion.div>

      {/* Capabilities + Link — one scroll trigger, appears together */}
      <motion.div
        className="mt-14"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {aboutData.capabilities.map((cap) => (
            <motion.div
              key={cap.title}
              className="rounded-xl border border-border bg-bg-secondary p-5 transition-colors duration-300 hover:border-accent/30"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <h3 className="font-display text-[16px] font-semibold tracking-tight text-text-primary">
                {cap.title}
              </h3>
              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-text-tertiary">
                {cap.titleEN}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/about"
            className="cursor-hover inline-flex items-center gap-1.5 rounded-full border border-accent px-4 py-2 text-[13px] font-medium text-accent transition-all duration-300 hover:bg-accent hover:text-white"
          >
            了解更多 &rarr;
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
