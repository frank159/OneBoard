/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class", // <--- isso é essencial
    content: [
      "./src/**/*.{ts,tsx,js,jsx,mdx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  