import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0a0e1a",
          800: "#111827",
          700: "#1a2235",
          600: "#243049",
        },
        cyan: {
          DEFAULT: "#00e5ff",
          50: "rgba(0,229,255,0.05)",
          100: "rgba(0,229,255,0.1)",
          200: "rgba(0,229,255,0.2)",
          400: "#00e5ff",
          600: "#00b8d4",
        },
        orange: {
          DEFAULT: "#ff6d00",
          50: "rgba(255,109,0,0.05)",
          100: "rgba(255,109,0,0.1)",
          200: "rgba(255,109,0,0.2)",
          400: "#ff6d00",
          600: "#e65100",
        },
        purple: {
          DEFAULT: "#b388ff",
          50: "rgba(179,136,255,0.05)",
          100: "rgba(179,136,255,0.1)",
          200: "rgba(179,136,255,0.2)",
          400: "#b388ff",
          600: "#9c5cff",
        },
        success: "#00e676",
        warning: "#ffd600",
        danger: "#ff1744",
        glass: {
          bg: "rgba(255,255,255,0.05)",
          border: "rgba(255,255,255,0.1)",
          hover: "rgba(255,255,255,0.08)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        glow: "0 0 20px rgba(0,229,255,0.15)",
        "glow-orange": "0 0 20px rgba(255,109,0,0.15)",
        "glow-purple": "0 0 20px rgba(179,136,255,0.15)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(ellipse at center, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
