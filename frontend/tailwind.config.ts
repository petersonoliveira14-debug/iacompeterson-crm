import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eff4fb",
          100: "#d0def4",
          200: "#a1bde8",
          700: "#163566",
          800: "#0f2044",
          900: "#0b1a38",
          950: "#07111f",
        },
        gold: {
          50: "#fdf9ec",
          100: "#faefc6",
          200: "#f6e190",
          400: "#d4a83e",
          500: "#c9a84c",
          600: "#b8943a",
          700: "#9a7b2c",
        },
        emerald: {
          brand: "#064e3b",
          primary: "#059669",
          light: "#d1fae5",
          50: "#ecfdf5",
          100: "#d1fae5",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        slate: {
          surface: "#f8fafc",
          border: "#e2e8f0",
          text: "#0f172a",
          muted: "#64748b",
        },
      },
      fontFamily: {
        heading: ["General Sans", "Inter", "sans-serif"],
        body: ["Satoshi", "Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "12px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
      },
      boxShadow: {
        navy: "0 10px 15px -3px rgb(15 32 68 / 0.25)",
        gold: "0 10px 15px -3px rgb(201 168 76 / 0.2)",
        emerald: "0 10px 15px -3px rgb(5 150 105 / 0.2)",
      },
      keyframes: {
        "step-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "step-in": "step-in 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "fade-in": "fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
