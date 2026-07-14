"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let rafId: number | null = null;
    let idleTimer: ReturnType<typeof setTimeout>;
    let mouseX = 0;
    let mouseY = 0;
    let isRunning = false;
    let currentState = ""; // "" | "hover" | "hover-light" | "phone"

    const startLoop = () => {
      if (isRunning) return;
      isRunning = true;
      const animate = () => {
        cursor.style.transform = `translate3d(${mouseX - 10}px, ${mouseY - 10}px, 0)`;
        rafId = requestAnimationFrame(animate);
      };
      rafId = requestAnimationFrame(animate);
    };

    const stopLoop = () => {
      if (!isRunning) return;
      isRunning = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      startLoop();
      clearTimeout(idleTimer);
      idleTimer = setTimeout(stopLoop, 300);
    };

    // Determine cursor state from target element — uses closest() to handle nested children
    const getState = (el: EventTarget | null): string => {
      if (!(el instanceof Element)) return "";
      if (el.closest(".cursor-phone")) return "phone";
      if (el.closest('a, button, input, textarea, [role="button"]')) return "hover";
      if (el.closest(".cursor-hover")) return "hover-light";
      return "";
    };

    // Event delegation: re-evaluate state on every mouseover boundary
    const onMouseOver = (e: MouseEvent) => {
      const next = getState(e.target);
      if (next !== currentState) {
        if (currentState) cursor.classList.remove(currentState);
        if (next) cursor.classList.add(next);
        currentState = next;
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      // When leaving an element, re-evaluate based on the element we're entering
      const next = getState(e.relatedTarget);
      if (next !== currentState) {
        if (currentState) cursor.classList.remove(currentState);
        if (next) cursor.classList.add(next);
        currentState = next;
      }
    };

    const onMouseDown = () => cursor.classList.add("click");
    const onMouseUp = () => cursor.classList.remove("click");

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    startLoop();

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      clearTimeout(idleTimer);
      stopLoop();
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="cursor-dot fixed top-0 left-0 z-[9999] will-change-transform"
      aria-hidden="true"
    />
  );
}
