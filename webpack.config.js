const mode = process.env.NODE_ENV || "development";
const path = require("path");
const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");

const common = merge([
  { output: { path: path.resolve(process.cwd(), "dist") } },
  parts.page({ title: "Checkout DappCon ticket with Circles" }),
  parts.loadSvg(),
  parts.svelte(mode),
  parts.extractCSS({ loaders: ["postcss-loader"] }),
  parts.useDotenv(),
  parts.polyfills(),
  parts.static(),
]);

const development = merge([
  { entry: ["./src/index.ts"] },
  { target: "web" },
  parts.generateSourceMaps({ type: "eval-source-map" }),
  parts.esbuild(),
  parts.devServer(),
]);

const production = merge(
  [
    { entry: ["./src/index.ts"] },
    parts.typescript(),
    parts.optimize(),
    // parts.analyze()
  ].filter(Boolean)
);

const getConfig = (mode) => {
  return merge(common, development, { mode });
  /*
  switch (mode) {
    case "production":
      return merge(common, production, { mode });
    case "development":
      return merge(common, development, { mode });
    default:
      throw new Error(`Unknown mode, ${mode}`);
  }*/
};

module.exports = getConfig(mode);
