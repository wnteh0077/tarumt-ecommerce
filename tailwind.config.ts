import { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      "theme-yellow": "#FCDC3E",
      "theme-green": "#006450",
      "theme-pink-100": "#F7CED7",
      "theme-pink-200": "#CE0F69",
      "theme-orange-100": "#DFA10E",
      "theme-orange-200": "#C81011",
      "blcak": "#000000",
      "white": "#ffffff",
    }
  },
  plugins: [],
};
export default config;
