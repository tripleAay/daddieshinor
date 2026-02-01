/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // ✅ REQUIRED for your toggle method (html.dark)

  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: "#18181b", // zinc-900
            lineHeight: "1.85",
            fontSize: "16px",

            h1: {
              fontWeight: "900",
              letterSpacing: "-0.02em",
            },
            h2: {
              fontWeight: "800",
              marginTop: "2.5em",
              marginBottom: "0.8em",
            },
            h3: {
              fontWeight: "700",
              marginTop: "2em",
            },

            p: {
              marginTop: "0",
              marginBottom: "1.1em",
            },

            a: {
              color: "#f97316", // orange-500
              fontWeight: "600",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            },

            blockquote: {
              fontStyle: "italic",
              borderLeftColor: "#f97316",
            },

            img: {
              borderRadius: "0.75rem",
            },
          },
        },

        invert: {
          css: {
            color: "#e4e4e7", // zinc-200
            a: { color: "#fb923c" },
            blockquote: { borderLeftColor: "#fb923c" },
          },
        },
      },
    },
  },

  plugins: [require("@tailwindcss/typography")],
};
