"use client";

import { motion } from "framer-motion";
import { projects } from "@/lib/data";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProjectExpandableGallery } from "@/components/home/project-expandable-gallery";

export function ProjectsSection() {
  return (
    <section
      id="work"
      className="mx-auto max-w-7xl scroll-mt-28 px-6 pt-24 pb-14 sm:px-8"
    >
      {/* Title — float-up reveal */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <SectionHeading
          label="selected project"
          title="精选项目"
        />
      </motion.div>

      {/* Gallery — float-up reveal (delayed) */}
      <motion.div
        className="mt-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
      >
        <ProjectExpandableGallery
          projects={(() => {
            const filtered = projects.filter(
              (p) => p.slug !== "pet-party" && p.slug !== "bangkok-festival"
            );
            const cny = filtered.find((p) => p.slug === "cny-2025");
            const rest = filtered.filter((p) => p.slug !== "cny-2025");
            return cny ? [cny, ...rest] : filtered;
          })()}
        />
      </motion.div>
    </section>
  );
}
