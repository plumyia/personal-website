import Link from "next/link";
import type { ProjectCard as ProjectCardType } from "@/lib/types";
import { Tag } from "./tag";

interface ProjectCardProps {
  project: ProjectCardType;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block"
    >
      <article className="flex flex-col gap-5">
        {/* Cover Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-bg-tertiary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.cover}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-text-primary/0 transition-all duration-300 group-hover:bg-text-primary/10">
            <span className="translate-y-2 text-[13px] font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              查看案例 &rarr;
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-[20px] font-semibold leading-tight tracking-tight text-text-primary">
              {project.name}
            </h3>
            <span className="text-[12px] text-text-tertiary">
              {project.date}
            </span>
          </div>

          <p className="line-clamp-2 text-[14px] leading-relaxed text-text-secondary">
            {project.summary}
          </p>

          <div className="mt-1 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
