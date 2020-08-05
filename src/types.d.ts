declare module "@babel/helper-module-imports" {
    import type { NodePath, types } from "@babel/core";

    function addNamed(path: NodePath, named: string, source: string): types.Identifier;
}