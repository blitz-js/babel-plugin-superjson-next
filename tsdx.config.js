module.exports = {
  rollup(config, options) {
    return {
      ...config,
      input: [
        "src/index.ts",
        "src/tools.tsx"
      ],
      output: {
        ...config.output,
        file: undefined,
        dir: "./dist"
      }
    };
  },
};
