/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.{html,ejs}",
    "./public/**/*.js",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#0EA5E9",
        secondary: "#06B6D4",
        accent: "#14B8A6",
        background: "#F8FAFC",
        surface: "#FFFFFF",
        text: "#0F172A",
        muted: "#64748B",
        border: "#E2E8F0",
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
      },

      boxShadow: {
        card: "0 10px 30px rgba(15,23,42,0.08)",
        navbar: "0 4px 20px rgba(15,23,42,0.06)",
      },
    },
  },

  plugins: [],
};