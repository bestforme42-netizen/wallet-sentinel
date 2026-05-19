"use client";

import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "cyan" | "orange" | "purple" | "none";
  animate?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  glow = "none",
  animate = true,
}: GlassCardProps) {
  const glowClass =
    glow === "cyan"
      ? "shadow-glow"
      : glow === "orange"
        ? "shadow-glow-orange"
        : glow === "purple"
          ? "shadow-glow-purple"
          : "";

  const Wrapper = animate ? motion.div : "div";
  const animProps = animate
    ? { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } }
    : {};

  return (
    <Wrapper {...(animProps as Record<string, unknown>)} className={`glass ${glowClass} p-4 rounded-xl ${className}`}>
      {children}
    </Wrapper>
  );
}
