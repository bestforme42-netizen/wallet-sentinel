"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  glow?: "cyan" | "orange" | "purple" | "none";
  animate?: boolean;
};

const glowMap = {
  cyan: "shadow-glow border-cyan-400/20",
  orange: "shadow-glow-orange border-orange-400/20",
  purple: "shadow-glow-purple border-purple-400/20",
  none: "",
};

export default function GlassCard({ children, className, glow = "none", animate = true }: Props) {
  const Component = animate ? motion.div : "div";
  const motionProps = animate
    ? { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } }
    : {};

  return (
    <Component
      className={cn("glass p-4", glowMap[glow], className)}
      {...motionProps}
    >
      {children}
    </Component>
  );
}
