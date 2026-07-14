"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { ProjectCard as ProjectCardType } from "@/lib/types";
import { Tag } from "@/components/shared/tag";

interface ProjectExpandableGalleryProps {
  projects: ProjectCardType[];
}

export function ProjectExpandableGallery({ projects }: ProjectExpandableGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const router = useRouter();

  const getFlexValue = (index: number) => {
    if (hoveredIndex === null) return 1;
    return hoveredIndex === index ? 2 : 0.5;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Horizontal Expandable Image Row */}
      <div className="flex gap-3 h-[420px] w-full">
        {projects.map((project, index) => (
          <motion.div
            key={project.slug}
            className="cursor-hover cursor-none relative overflow-hidden rounded-lg"
            role="button"
            tabIndex={0}
            style={{ flex: 1 }}
            animate={{ flex: getFlexValue(index) }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => router.push(`/projects/${project.slug}`)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.cover}
              alt={project.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Overlay: darker on non-hovered, lighter on hovered */}
            <motion.div
              className="absolute inset-0 bg-black"
              initial={{ opacity: 0 }}
              animate={{
                opacity: hoveredIndex === index ? 0.05 : hoveredIndex === null ? 0.15 : 0.35,
              }}
              transition={{ duration: 0.3 }}
            />
            {/* "View case" indicator on hover */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-white text-sm font-medium tracking-wide">
                查看详情 &rarr;
              </span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Info Section — shows hovered project details or "view all" button, fixed height */}
      <div className="h-[88px]">
        {hoveredIndex !== null ? (() => {
          const p = projects[hoveredIndex];
          return (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <div className="flex items-center gap-3">
                <h3 className="font-display text-xl font-semibold tracking-tight text-text-primary">
                  {p.name}
                </h3>
                <span className="text-xs text-text-tertiary">{p.date}</span>
              </div>
              <p className="text-sm leading-relaxed text-text-secondary whitespace-nowrap">
                {p.summary}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {p.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </motion.div>
          );
        })() : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center h-full"
          >
            <button
              onClick={() => router.push("/work")}
              className="cursor-hover inline-flex items-center gap-2 rounded-full border border-accent px-5 py-2 text-[13px] font-medium text-accent transition-all duration-300 hover:bg-accent hover:text-white"
            >
              查看更多项目 &rarr;
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
