"use client";

import * as React from "react";
import { motion, type Transition } from "framer-motion";
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
    const drift = (
      dx: number,
      dy: number,
      duration: number,
    ): {
      animate?: { x: number[]; y: number[] };
      transition?: Transition;
    } =>
      reduced
        ? {}
        : {
            animate: { x: [0, dx, 0], y: [0, dy, 0] },
            transition: { repeat: Infinity, duration, ease: "easeInOut" },
          };
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <motion.div
          className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-sage/30 blur-3xl dark:bg-sage/15"
          {...drift(28, 20, 14)}
        />
        <motion.div
          className="absolute -bottom-10 -right-16 h-50 w-50 rounded-full bg-maroon/45 blur-3xl "
          {...drift(-14, -18, 17)}
        />
        <motion.div
          className="absolute -right-20 top-1/3 h-25 w-25 rounded-full bg-deep blur-3xl dark:bg-sage/40"
          {...drift(-15, 12, 15)}
        />
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
