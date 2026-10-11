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
    // Phones: coarse pointer or narrow screen.
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
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="h-full w-full scale-[2] opacity-40 blur-[16px]">
          <PrismaticBurst
            colors={PALETTE}
            intensity={20}
            speed={0.03}
            distort={0.4}
            rayCount={3}
            animationType="rotate3d"
            lightMode={theme === "light"}
            paused={reduced}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="h-full w-full scale-125 opacity-40  blur-[32px] saturate-[1.15] ">
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
