declare module '@babel/helper-module-imports' {
  import type { Identifier } from '@babel/types';
  import type { NodePath } from '@babel/core';
  function addNamed(path: NodePath, named: string, source: string): Identifier;
}
