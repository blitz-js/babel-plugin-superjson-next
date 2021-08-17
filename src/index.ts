import type { NodePath, PluginObj, PluginPass } from '@babel/core';
import { addNamed as addNamedImport } from '@babel/helper-module-imports';
import {
  callExpression,
  ClassDeclaration,
  classExpression,
  ExportNamedDeclaration,
  Expression,
  FunctionDeclaration,
  functionExpression,
  isClassDeclaration,
  isExportDefaultDeclaration,
  isExportNamedDeclaration,
  isFunctionDeclaration,
  isFunctionExpression,
  isIdentifier,
  isVariableDeclaration,
  variableDeclaration,
  variableDeclarator,
  arrayExpression,
  stringLiteral,
} from '@babel/types';
import * as nodePath from 'path';

function functionDeclarationToExpression(declaration: FunctionDeclaration) {
  return functionExpression(
    declaration.id,
    declaration.params,
    declaration.body,
    declaration.generator,
    declaration.async
  );
}

function classDeclarationToExpression(declaration: ClassDeclaration) {
  return classExpression(
    declaration.id,
    declaration.superClass,
    declaration.body,
    declaration.decorators
  );
}

function getFileName(state: PluginPass) {
  const { filename, cwd } = state;

  if (!filename) {
    return undefined;
  }

  if (cwd && filename.startsWith(cwd)) {
    return filename.slice(cwd.length);
  }

  return filename;
}

const functionsToReplace = ['getServerSideProps', 'getStaticProps'];

function transformPropGetters(
  path: NodePath<ExportNamedDeclaration>,
  transform: (v: Expression) => Expression
): 'found' | undefined {
  const { node } = path;

  if (isFunctionDeclaration(node.declaration)) {
    const { id: functionId } = node.declaration;
    if (!functionId) {
      return;
    }

    if (!functionsToReplace.includes(functionId.name)) {
      return;
    }

    node.declaration = variableDeclaration('const', [
      variableDeclarator(
        functionId,
        transform(functionDeclarationToExpression(node.declaration))
      ),
    ]);

    return 'found';
  }

  if (isVariableDeclaration(node.declaration)) {
    for (const declaration of node.declaration.declarations) {
      if (
        isIdentifier(declaration.id) &&
        functionsToReplace.includes(declaration.id.name) &&
        declaration.init
      ) {
        declaration.init = transform(declaration.init);
        return 'found';
      }
    }
  }
}

function addWithSuperJSONPropsImport(path: NodePath<any>) {
  return addNamedImport(
    path,
    'withSuperJSONProps',
    'babel-plugin-superjson-next/tools'
  );
}

function addWithSuperJSONPageImport(path: NodePath<any>) {
  return addNamedImport(
    path,
    'withSuperJSONPage',
    'babel-plugin-superjson-next/tools'
  );
}

function wrapExportDefaultDeclaration(path: NodePath<any>) {
  function wrapInHOC(expr: Expression): Expression {
    return callExpression(addWithSuperJSONPageImport(path), [expr]);
  }

  const { node } = path;

  if (isIdentifier(node.declaration)) {
    node.declaration = wrapInHOC(node.declaration);
  }

  if (isFunctionExpression(node.declaration)) {
    node.declaration = wrapInHOC(node.declaration);
  }

  if (
    isFunctionDeclaration(node.declaration) ||
    isClassDeclaration(node.declaration)
  ) {
    if (node.declaration.id) {
      path.insertBefore(node.declaration);
      node.declaration = wrapInHOC(node.declaration.id);
    } else {
      if (isFunctionDeclaration(node.declaration)) {
        node.declaration = wrapInHOC(
          functionDeclarationToExpression(node.declaration)
        );
      } else {
        node.declaration = wrapInHOC(
          classDeclarationToExpression(node.declaration)
        );
      }
    }
  }
}

const filesToSkip = ([] as string[]).concat(
  ...['_app', '_document', '_error'].map((name) => [
    name + '.js',
    name + '.jsx',
    name + '.ts',
    name + '.tsx',
  ])
);

function shouldBeSkipped(filePath: string) {
  if (!filePath.includes('pages' + nodePath.sep)) {
    return true;
  }
  if (filePath.includes('pages' + nodePath.sep + 'api')) {
    return true;
  }
  return filesToSkip.some((fileToSkip) => filePath.includes(fileToSkip));
}

function superJsonWithNext(): PluginObj {
  return {
    name: 'add superjson to pages with prop getters',
    visitor: {
      Program(path, state) {
        const propsToBeExcluded = (state.opts as any).exclude as
          | string[]
          | undefined;

        const filePath =
          getFileName(state) ?? nodePath.join('pages', 'Default.js');

        if (shouldBeSkipped(filePath)) {
          return;
        }

        const body = path.get('body');

        const exportDefaultDeclaration = body.find((path) =>
          isExportDefaultDeclaration(path)
        );
        if (!exportDefaultDeclaration) {
          return;
        }

        const namedExportDeclarations = body
          .filter((path) => path.isExportNamedDeclaration())
          .map((path) => path as NodePath<ExportNamedDeclaration>);

        const containsNSSPTag = namedExportDeclarations.some((path) => {
          return (
            isVariableDeclaration(path.node.declaration) &&
            path.node.declaration.declarations.some(
              (decl) => isIdentifier(decl.id) && decl.id.name === '__N_SSP'
            )
          );
        });

        let transformedOne = false;
        namedExportDeclarations.forEach((path) => {
          const found = transformPropGetters(path, (decl) => {
            return callExpression(addWithSuperJSONPropsImport(path), [
              decl,
              arrayExpression(
                propsToBeExcluded?.map((prop) => stringLiteral(prop))
              ),
            ]);
          });

          if (found === 'found') {
            transformedOne = true;
          }
        });

        if (!transformedOne && !containsNSSPTag) {
          return;
        }

        wrapExportDefaultDeclaration(exportDefaultDeclaration);
      },
    },
  };
}

export default superJsonWithNext;
