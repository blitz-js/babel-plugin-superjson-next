module.exports = {
  rollup(config, options) {
    return {
      ...config,
      input: [
        "src/plugin.ts",
        "src/index.tsx"
      ],
      output: {
        ...config.output,
        file: undefined,
        dir: "./dist"
      }
    };
  },
};
