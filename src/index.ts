import { PluginObj } from '@babel/core';

function reverse(string: string): string {
  return string
    .split('')
    .reverse()
    .join('');
}

function superJsonWithNext(): PluginObj {
  return {
    name: 'identifier reverse',
    visitor: {
      Identifier(idPath) {
        idPath.node.name = reverse(idPath.node.name);
      },
    },
  };
}

export default superJsonWithNext;
