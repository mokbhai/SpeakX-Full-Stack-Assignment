/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#FFF5EE",
          100: "#FFE4D4",
          200: "#FFC9AA",
          300: "#FFAD80",
          400: "#FF9255",
          500: "#F47B20", // Main orange
          600: "#E06910",
          700: "#CC5A00",
          800: "#A84B00",
          900: "#843C00",
        },
        secondary: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        success: {
          500: "#38A169",
        },
        error: {
          500: "#E53E3E",
        },
      },
      boxShadow: {
        card: "0 2px 4px rgba(0,0,0,0.05)",
        "card-hover": "0 4px 8px rgba(0,0,0,0.1)",
      },
      spacing: {
        18: "4.5rem",
      },
      borderRadius: {
        xl: "1rem",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-in": "slideIn 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
