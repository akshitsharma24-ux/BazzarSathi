/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      colors: {
        // Warm terracotta/saffron -- the bazaar accent.
        saathi: {
          50: "#fef6ee",
          100: "#fdead3",
          200: "#fad3a6",
          300: "#f6b46e",
          400: "#f18d3a",
          500: "#ec6f1c",
          600: "#dd5612",
          700: "#b74011",
          800: "#933415",
          900: "#772c14",
        },
        // Deep teal/indigo -- secondary accent for data & links.
        mesh: {
          50: "#eefbfa",
          100: "#d4f4f1",
          200: "#ade8e3",
          300: "#79d5cd",
          400: "#3fb6ac",
          500: "#249a91",
          600: "#1c7c76",
          700: "#1a635f",
          800: "#194f4d",
          900: "#194241",
        },
        // Warm ink neutrals instead of stock gray.
        ink: {
          50: "#f8f7f5",
          100: "#efece7",
          200: "#dfd9d0",
          300: "#c5bcae",
          400: "#a89c8a",
          500: "#8d7f6d",
          600: "#6f6355",
          700: "#564d43",
          800: "#39332c",
          900: "#211d18",
          950: "#141210",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(33, 29, 24, 0.04), 0 8px 24px -12px rgba(33, 29, 24, 0.12)",
        "card-hover": "0 4px 10px rgba(33, 29, 24, 0.06), 0 16px 36px -14px rgba(33, 29, 24, 0.18)",
        glow: "0 0 0 4px rgba(236, 111, 28, 0.12)",
      },
      backgroundImage: {
        "grain": "radial-gradient(circle at 1px 1px, rgba(33,29,24,0.055) 1px, transparent 0)",
        "hero-gradient": "radial-gradient(120% 120% at 15% 0%, #fef1e2 0%, #fdf8f2 45%, #f8f7f5 100%)",
      },
      backgroundSize: {
        grain: "18px 18px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "grow-bar": {
          "0%": { transform: "scaleY(0)" },
          "100%": { transform: "scaleY(1)" },
        },
        "pop": {
          "0%": { transform: "scale(0.94)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.4s ease-out both",
        "grow-bar": "grow-bar 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "pop": "pop 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        "shimmer": "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
