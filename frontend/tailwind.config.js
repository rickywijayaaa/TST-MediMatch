/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF3E4D",
        secondary: "#F7F7F7",
        grayText: "#9E9E9E",
        white: "#FFFFFF",
      },
    },
  },
  plugins: [],
}

