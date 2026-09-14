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
        burgundy: {
          50: "#FCF4F6",
          100: "#F5E4E8",
          200: "#EBC9D3",
          300: "#D49CAB",
          400: "#B86681",
          500: "#7E2546",
          600: "#531E32",
          700: "#3D0F20",
          800: "#2C0A17",
          900: "#1B060E",
          950: "#120309",
          DEFAULT: "#3D0F20",
        },
        rose: {
          tint: "#FFF4F3",
          soft: "#FAE8E8",
        },
        sage: {
          DEFAULT: "#6D8554",
          light: "#8CA473",
          dark: "#52653F",
        },
        dark: {
          DEFAULT: "#1D1D1D",
          soft: "#2A2A2A",
          muted: "#6B7280",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
        serif: ["var(--font-cormorant)", "serif"],
        script: ["var(--font-pinyon)", "cursive"],
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
