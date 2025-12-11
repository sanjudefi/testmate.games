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
        // TestMate Brand Colors
        primary: {
          blue: "#4F7BFE",
        },
        accent: {
          purple: "#A855F7",
        },
        background: {
          dark: "#0F172A",
          card: "#1E293B",
        },
        border: {
          grey: "#334155",
        },
        text: {
          white: "#FFFFFF",
          light: "#CBD5E1",
        },
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(79, 123, 254, 0.3)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
