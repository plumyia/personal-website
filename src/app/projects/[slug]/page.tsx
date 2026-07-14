import { projectDetails } from "@/lib/data";
import { projects } from "@/lib/data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProjectDetail } from "@/components/projects/project-detail";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectDetails[slug];
  if (!project) return {};

  return {
    title: `${project.name} | 徐羽佳`,
    description: project.description?.[0] ?? "",
    other: {
      // Preload hero image so it renders before the background gradient
      "hero-image": project.hero,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectDetails[slug];
  if (!project) notFound();

  return (
    <>
      {/* SSR preload — browser discovers hero during HTML parse, NOT after JS hydrates.
          Critical because the hero is a progressive JPEG now: first scan renders within
          ~20% of download, so early discovery = near-instant first paint. */}
      <link rel="preload" as="image" href={project.hero} fetchPriority="high" />
      <ProjectDetail key={project.slug} project={project} />
    </>
  );
}
