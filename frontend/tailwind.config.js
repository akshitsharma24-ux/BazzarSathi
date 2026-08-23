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
        // Bazaar orange -- decision / action / attention. Used sparingly.
        saathi: {
          50: "#fdf3ee",
          100: "#fbe3d5",
          200: "#f4c19c",
          300: "#eb9d68",
          400: "#e37940",
          500: "#d95d20",
          600: "#c04d17",
          700: "#9c3d14",
          800: "#7c3214",
          900: "#642a13",
        },
        // Deep teal -- data / network / healthy state.
        mesh: {
          50: "#eef5f4",
          100: "#d3e6e4",
          200: "#a3cdc8",
          300: "#6fb0a9",
          400: "#3d928a",
          500: "#227872",
          600: "#176b65",
          700: "#155650",
          800: "#144643",
          900: "#123a37",
        },
        // Paper + ink neutrals -- the base of the product; most of the UI.
        ink: {
          25: "#faf9f6",
          50: "#f7f4ee",
          100: "#efebe2",
          200: "#e1dbcd",
          300: "#c7bfac",
          400: "#a29a89",
          500: "#7d766a",
          600: "#66706c",
          700: "#4c4842",
          800: "#332f2a",
          900: "#18201e",
          950: "#0f1413",
        },
      },
      boxShadow: {
        card: "0 1px 1px rgba(15, 20, 19, 0.03), 0 1px 3px rgba(15, 20, 19, 0.04)",
        "card-hover": "0 2px 4px rgba(15, 20, 19, 0.05), 0 4px 10px rgba(15, 20, 19, 0.06)",
        focus: "0 0 0 3px rgba(217, 93, 32, 0.18)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "rise-in": {
          "0%": { opacity: 0, transform: "translateY(4px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "grow-bar": {
          "0%": { transform: "scaleY(0)" },
          "100%": { transform: "scaleY(1)" },
        },
        "grow-x": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out both",
        "rise-in": "rise-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) both",
        "grow-bar": "grow-bar 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "grow-x": "grow-x 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "shimmer": "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
