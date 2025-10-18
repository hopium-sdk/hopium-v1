import React, { useEffect, useRef } from "react";

export const BlinkP = ({
  children,
  className = "",
  duration = 800,
  respectReducedMotion = true,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  respectReducedMotion?: boolean;
}) => {
  const elRef = useRef<HTMLParagraphElement>(null);
  const prev = useRef(children);
  const mainBgRef = useRef<string | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    // Cache the computed color of `bg-main` once
    if (!mainBgRef.current) {
      // Temporarily apply bg-main to read the actual color
      el.classList.add("bg-main");
      const color = getComputedStyle(el).backgroundColor; // e.g. 'rgb(...)'
      el.classList.remove("bg-main");
      mainBgRef.current = color;
    }
  }, []);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (Object.is(prev.current, children)) return;

    if (respectReducedMotion && typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      prev.current = children;
      return;
    }

    // Cancel any in-flight animations so rapid updates restart cleanly
    el.getAnimations?.().forEach((a) => a.cancel());

    const startColor = mainBgRef.current ?? "transparent";
    const endColor = "transparent"; // final state

    // Animate bg color: flash then back to none
    el.animate([{ backgroundColor: startColor }, { backgroundColor: endColor }], {
      duration,
      easing: "ease-in-out",
      direction: "normal",
      iterations: 1,
      fill: "none", // <- do NOT persist the animated style
    });

    prev.current = children;
  }, [children, duration, respectReducedMotion]);

  return (
    <p ref={elRef} className={className}>
      {children}
    </p>
  );
};
