import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      roboto: ["Roboto Slab", "serif"],
      domine: ["Domine", "serif"],
    },
    extend: {
      colors: {
        sec: { DEFAULT: "#404040" },
        neutral: {
          100: "#000000",
          90: "#1A1A1A",
          80: "#333333",
          70: "#4D4D4D",
          60: "#666666",
          50: "#808080`",
          40: "#999999",
          30: "#B3B3B3",
          20: "#CCCCCC",
          10: "#E6E6E6",
          0: "#FFFFFF",
        },
      },
      cursor: {
        dot: "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMyIgaGVpZ2h0PSIzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjEuNSIgY3k9IjEuNSIgcj0iMS41IiBmaWxsPSJibGFjayIgLz48L3N2Zz4=)",
        bucket:
          "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAABMklEQVR4nNXTvytFYRzH8ddAfqwGTIoVKf4FUgb/gB+LH3HJIkUGheGWLMy6mS3KZLJJWAzKYHAHm0wm+dGp59TtdO65595B+dS35zw9z3n3+X6/z5c/UjuGwzqLnUZBQzjDDZYxhy/8oFgvbATXGAj7RXwH2E8j0EOMh++lFFgcB2jJA5zHNvrxUQUWxys20JYFbMZDcDCIqeD6Ald4TEDfcI/JasDVRJpPOMUe1jGGowT0BKWwtlbCVjJqFsU5RnGcclZEIdxpimDd+KxRs+jpPGec72MXaxGwKwcwK15CnWdwG6dcqJFyFqwXPbjEXWUdF+qEltEX/u1IA6Z1upazypEtpQHzOK10FmsiNCUVmOW0nHAWaxqbYTDkhaY5E9QZOr2VBYwUzfd7eA7VYP9MvzG4qXCZXvVcAAAAAElFTkSuQmCC)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        slideDown: {
          "0%": { transform: "translateY(-200%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        slideDown: "slideDown .5s  forwards",
      },
    },
  },
  plugins: [],
};
export default config;
