import type { Metadata } from "next";
import { WorkViewer } from "@/components/layout/work-viewer";

export const metadata: Metadata = {
  title: "Project",
};

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-bg-primary pt-16 pb-[3vh]">
      <WorkViewer />
    </main>
  );
}
