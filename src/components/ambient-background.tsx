"use client";

import * as React from "react";
import PrismaticBurst from "./prismatic-burst";
import { useTheme } from "./theme-provider";

// Card-fitted hues: sage, maroon, deep teal. Heavily blurred so only
// soft washes show through — no sharp rays, no CSS gradients.
const PALETTE = ["#0E2931","#3f6751", "#330511", ];

export function AmbientBackground() {
  const { theme } = useTheme();
  const [reduced, setReduced] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent): void => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    // Phones skip WebGL entirely: a fullscreen raymarcher + fullscreen
    // blur per frame overheats mobile GPUs and drains battery.
    const coarse = window.matchMedia("(pointer: coarse)");
    const narrow = window.matchMedia("(max-width: 640px)");
    const updateMobile = (): void =>
      setIsMobile(coarse.matches || narrow.matches);
    updateMobile();
    coarse.addEventListener("change", updateMobile);
    narrow.addEventListener("change", updateMobile);
    return () => {
      mq.removeEventListener("change", onChange);
      coarse.removeEventListener("change", updateMobile);
      narrow.removeEventListener("change", updateMobile);
    };
  }, []);

  if (isMobile) {
    // Static fallback: flat base + dot grid, zero GPU cost.
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cream dark:bg-deep"
      >
        <div className="absolute inset-0 bg-[radial-gradient(rgba(14,41,49,0.10)_1.2px,transparent_1.2px)] bg-[size:20px_20px] dark:hidden" />
        <div className="absolute inset-0 hidden bg-[radial-gradient(rgba(248,248,236,0.10)_1.2px,transparent_1.2px)] bg-[size:20px_20px] dark:block" />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="h-full w-full scale-125 opacity-40  blur-[32px] saturate-[1.15] dark:opacity-40">
        <PrismaticBurst
          colors={PALETTE}
          intensity={30}
          speed={0.1}
          distort={1}
          rayCount={8}
          animationType="rotate3d"
          lightMode={theme === "light"}
          paused={reduced}
        />
      </div>
    </div>
  );
}
