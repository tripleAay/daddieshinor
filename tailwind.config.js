/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
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

            // Headings
            h1: { fontWeight: "900", letterSpacing: "-0.02em" },
            h2: { fontWeight: "800", marginTop: "2.5em", marginBottom: "0.8em" },
            h3: { fontWeight: "700", marginTop: "2em" },

            // Paragraphs – justification + margin tweaks
            p: {
              marginTop: "0",
              marginBottom: "1.1em",
              textAlign: "left",           // ← JUSTIFICATION
              hyphens: "manual",                // optional: better line breaks (especially good for longer words)
              textWrap: "pretty",             // modern: avoids awkward widows/orphans
            },

            // Links
            a: {
              color: "#706947", // orange-500
              fontWeight: "600",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            },

            // Blockquote
            blockquote: {
              fontStyle: "italic",
              borderLeftColor: "#706947",
            },

            // Images from WP (centered + rounded + shadow)
            img: {
              borderRadius: "0.75rem",
              margin: "2rem auto",          // ← better spacing & centering
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
            },

            // YouTube embeds (WP usually outputs <figure><iframe ...></iframe></figure>)
            figure: {
              margin: "2.5rem 0",
            },
            iframe: {
              width: "100%",
              height: "auto",
              aspectRatio: "16 / 9",        // ← perfect 16:9 for YouTube
              borderRadius: "0.75rem",
              boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
            },

            // ── DROP CAP ── First paragraph's first letter only
            "& > p:first-of-type": {
              marginTop: "0",
              "&::first-letter": {
                color: "#706947",               // orange-600 – sync with your orange links
                float: "left",
                fontWeight: "900",
                fontSize: "4.5rem",             // big – adjust 4rem → 5rem as needed
                lineHeight: "0.85",
                marginRight: "0.5rem",
                marginTop: "0.2rem",
                fontFamily: "serif",            // optional: classic drop-cap feel
              },
            },

            // Modern drop-cap support (better rendering in recent browsers)
            "& > p:first-of-type::first-letter": {
              initialLetter: "4 2",             // drops over ~4 lines, sink 2 lines
            },
          },
        },

        invert: {
          css: {
            color: "#e4e4e7", // zinc-200
            a: { color: "#c5bc8d" },
            blockquote: { borderLeftColor: "#c5bc8d" },

            // Dark mode drop cap adjustment
            "& > p:first-of-type::first-letter": {
              color: "#c5bc8d",               // orange-400-ish in dark
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};