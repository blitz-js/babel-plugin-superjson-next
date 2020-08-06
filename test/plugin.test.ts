import superJsonWithNext from '../src/plugin';
import pluginTester from 'babel-plugin-tester';
import * as path from 'path';

pluginTester({
  plugin: superJsonWithNext,
  fixtures: path.join(__dirname, 'pages'),
});
