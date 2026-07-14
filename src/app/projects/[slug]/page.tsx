import { projectDetails } from "@/lib/data";
import { projects } from "@/lib/data";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/projects/project-detail";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectDetails[slug];
  if (!project) notFound();

  return <ProjectDetail project={project} />;
}
