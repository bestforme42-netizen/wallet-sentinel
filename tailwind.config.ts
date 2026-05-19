import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          bg: "#0a0e1a",
          panel: "#111827",
          lo: "#1f2937",
          mid: "#6b7280",
          hi: "#e5e7eb",
        },
        neon: {
          green: "#22c55e",
          blue: "#3b82f6",
          purple: "#a855f7",
          amber: "#f59e0b",
          red: "#ef4444",
        },
        safe: "#22c55e",
        warn: "#f59e0b",
        danger: "#ef4444",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
