import type { Metadata } from "next";
import { HomePageClient } from "@/components/home/HomePageClient";

export const metadata: Metadata = {
  title: "Homepage - 徐羽佳",
};

export default function HomePage() {
  return <HomePageClient />;
}
