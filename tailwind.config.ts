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
        obsidian: "#0B0B0B",
        champagne: {
          DEFAULT: "#D4AF37",
          light: "#F3E8C8",
          dark: "#AA8A2A",
        },
        alabaster: "#F9F8F6",
        slateMuted: "#71717A",
        atelier: {
          dark: "#0B0B0B",
          noir: "#121214",
          surface: "#18181B",
          card: "#141416",
          border: "#27272A",
          muted: "#71717A",
          light: "#F9F8F6",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Playfair Display", "serif"],
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.25em",
        extrawide: "0.35em",
      },
    },
  },
  plugins: [],
};

export default config;
