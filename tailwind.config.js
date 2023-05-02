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
  plugins: [
    require("daisyui"),
    require("@tailwindcss/typography")
  ],
};
