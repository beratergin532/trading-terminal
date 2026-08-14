import type { Config } from "tailwindcss";

// ---------------------------------------------------------------------------
// Design tokens — "Ledger & Ticker" system
// Dark ink terminal, brass-gold signal accent, tri-type-role system:
//   mono   -> raw market data / prices / tickers (tabular-nums everywhere)
//   sans   -> interface chrome, labels, nav
//   serif  -> AI-authored analyst prose (thesis, summaries, reasoning)
// ---------------------------------------------------------------------------

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0E11", // page background
          surface: "#12161B", // card / panel background
          raised: "#171C22", // hover / elevated surface
          line: "#232932", // hairline borders & dividers
        },
        paper: {
          DEFAULT: "#E8E6DE", // primary text, warm off-white ledger paper
          muted: "#8B92A0", // secondary / caption text
          faint: "#565D6B", // tertiary / disabled text
        },
        signal: {
          long: "#3DD68C", // gains / BUY
          longMuted: "#1C3D30",
          short: "#F0563D", // losses / SELL
          shortMuted: "#3D2621",
          hold: "#E8B84B", // HOLD / neutral action
        },
        brass: {
          DEFAULT: "#D4A94A", // signature accent — the "Midas" gold
          dim: "#8A7136",
          bright: "#F0CD75",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "flash-up": {
          "0%": { backgroundColor: "rgba(61,214,140,0.22)" },
          "100%": { backgroundColor: "transparent" },
        },
        "flash-down": {
          "0%": { backgroundColor: "rgba(240,86,61,0.22)" },
          "100%": { backgroundColor: "transparent" },
        },
      },
      animation: {
        marquee: "marquee 45s linear infinite",
        "flash-up": "flash-up 1s ease-out",
        "flash-down": "flash-down 1s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
