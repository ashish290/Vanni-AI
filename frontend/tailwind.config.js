/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        saffron: {
          50: "#FFF5EE",
          100: "#FFE8D6",
          200: "#FFD0AD",
          300: "#FFB380",
          400: "#FF8F52",
          500: "#FF6B35",
          600: "#E55A2B",
          700: "#CC4A22",
          800: "#993818",
          900: "#66250F",
        },
        navy: {
          50: "#E8F0F8",
          100: "#C5D9EC",
          200: "#9CBBDA",
          300: "#729CC8",
          400: "#4E80B6",
          500: "#1B4F72",
          600: "#174566",
          700: "#123A55",
          800: "#0E2F44",
          900: "#0A2333",
        },
        turmeric: {
          50: "#FEF7E6",
          100: "#FDECC0",
          200: "#FADA8A",
          300: "#F7C854",
          400: "#F4B727",
          500: "#F4A300",
          600: "#D48E00",
          700: "#B47900",
          800: "#8A5C00",
          900: "#604000",
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "bounce-in": "bounceIn 0.5s ease-out",
        "pulse-soft": "pulseSoft 2s infinite",
        typing: "typing 1.4s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "50%": { transform: "scale(1.02)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        typing: {
          "0%": { opacity: "0.2" },
          "20%": { opacity: "1" },
          "100%": { opacity: "0.2" },
        },
      },
    },
  },
  plugins: [],
};
