/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["var(--font-roboto)"],
      },
      colors: {
        darkBorder: "#38444d",
        darkHover: "#f7f9f91a",
      },
      keyframes: {
        "glitch-1": {
          "0%, 100%": {
            transform: "none",
            textShadow: "none",
          },
          "40%": {
            transform: "skew(-2deg, -2deg)",
            textShadow: "-2px 2px #38444d, -1px -1px #000000",
          },
          "41%": {
            transform: "skew(2deg, 2deg)",
            textShadow: "2px -2px #000000, 1px 1px #38444d",
          },
          "45%": {
            transform: "none",
            textShadow: "none",
          },
        },
        "glitch-2": {
          "0%, 100%": {
            transform: "none",
            opacity: 1,
          },
          "65%": {
            transform: "translate(3px, 0) skew(2deg)",
            opacity: 0.75,
          },
          "66%": {
            transform: "translate(-2px, 0) skew(-2deg)",
            opacity: 0.75,
          },
          "70%": {
            transform: "none",
            opacity: 1,
          },
        },
        "glitch-3": {
          "0%, 100%": {
            transform: "none",
            opacity: 1,
          },
          "85%": {
            transform: "translate(-3px, 0) scale(1.1)",
            opacity: 0.75,
          },
          "86%": {
            transform: "translate(3px, 0) scale(0.9)",
            opacity: 0.75,
          },
          "90%": {
            transform: "none",
            opacity: 1,
          },
        },
      },
      animation: {
        "glitch-1": "glitch-1 3s infinite linear",
        "glitch-2": "glitch-2 3s infinite linear",
        "glitch-3": "glitch-3 3s infinite linear",
      },
      textShadow: {
        glitch: "2px 2px #38444d, -2px -2px #000000",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".shadow-glitch": {
          textShadow: "2px 2px #38444d, -2px -2px #000000",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
