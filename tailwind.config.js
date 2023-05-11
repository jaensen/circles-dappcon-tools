module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },

  mode: "jit",
  content: ["./src/**/*.svelte", "./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  daisyui: {
    themes: ["light", "dark"],
  },
  variants: {
    backgroundClip: ["responsive"],
  },
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: "#5244F3",
        },
        black: {
          DEFAULT: "#202020",
        },
      },
      fontFamily: {
        primary: ["Averta", "sans"]
      },
    }
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/typography")
  ]
};
