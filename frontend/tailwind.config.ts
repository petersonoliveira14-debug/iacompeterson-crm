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
        sky: {
          accent: "#0ea5e9",
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
        emerald: "0 10px 15px -3px rgb(5 150 105 / 0.2)",
        sky: "0 10px 15px -3px rgb(14 165 233 / 0.2)",
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
