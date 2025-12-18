/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#5D5FEF",
        secondary: "#818CF8",
        "surface-light": "#F8FAFC",
        "surface-dark": "#0F172A",
        "accent-red": "#DC2626",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
}
