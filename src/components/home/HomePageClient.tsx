"use client";

import { useEffect, useState } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { ProjectsSection } from "@/components/home/projects-section";
import { BrandsGallerySection } from "@/components/home/BrandsGallerySection";
import { AboutPreview } from "@/components/home/about-preview";
import { LoadingScreen } from "@/components/loading/LoadingScreen";

const LOADING_KEY = "__home_loading__";

function wasLoadingShown(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(LOADING_KEY) === "1";
}

export function HomePageClient() {
  // Always start with loading=true (SSR renders LoadingScreen, not home content).
  // After hydration, check if loading was already shown this session and skip if so.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wasLoadingShown()) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Clear marker on page unload (refresh / close tab)
    // so loading reappears on next full load.
    // Client-side navigations do NOT fire beforeunload.
    const handleBeforeUnload = () => {
      sessionStorage.removeItem(LOADING_KEY);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem(LOADING_KEY, "1");
    setLoading(false);
  };

  if (loading) {
    return (
      <>
        {/* Placeholder keeps <main> height so Footer stays at bottom
            instead of jumping up next to the fixed Header. */}
        <div className="min-h-screen" aria-hidden="true" />
        <LoadingScreen onComplete={handleComplete} />
      </>
    );
  }

  return (
    <>
      <HeroSection />
      <ProjectsSection />
      <BrandsGallerySection />
      <AboutPreview />
    </>
  );
}
