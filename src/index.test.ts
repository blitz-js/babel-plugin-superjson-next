import superJsonWithNext from './';
import pluginTester from 'babel-plugin-tester';

const dontUsePrettier = (c: string) => c

pluginTester({
  plugin: superJsonWithNext,
   
  tests: {
    'changes this code': {
      // input to the plugin
      code: 'var hello = "hi";',
      // expected output
      output: 'var olleh = "hi";',
    },
  },

  formatResult: dontUsePrettier,
});
