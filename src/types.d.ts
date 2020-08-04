declare module "@babel/helper-module-imports" {
    import type { NodePath, types } from "@babel/core";

    function addDefault(path: NodePath, source: string, opts?: { nameHint: string }): types.Identifier;
}