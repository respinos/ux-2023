const litPlugin= require("esbuild-plugin-lit");
const inlineImagePlugin = require("esbuild-plugin-inline-image");

require("esbuild").build({
  entryPoints: ["index.js"],
  bundle: true,
  outfile: "dist/component.js",
  minify: false,
  plugins: [litPlugin.default(), inlineImagePlugin() ],
});
