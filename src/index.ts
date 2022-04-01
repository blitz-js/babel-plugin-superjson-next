import type { NodePath, PluginObj, PluginPass } from '@babel/core';
import { addNamed as addNamedImport } from '@babel/helper-module-imports';
import {
  arrayExpression,
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
  isIdentifier,
  isVariableDeclaration,
  stringLiteral,
  variableDeclaration,
  variableDeclarator,
  importDeclaration,
  importDefaultSpecifier,
  identifier,
  exportDefaultDeclaration,
  Identifier,
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
  } else {
    node.declaration = wrapInHOC(node.declaration);
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

/**
 * transforms `export { default } from ".."` import & export line
 */
function transformImportExportDefault(paths: NodePath<any>[]) {
  for (const path of paths) {
    if (isExportNamedDeclaration(path)) {
      for (const specifier of path.node.specifiers) {
        if (specifier.local.name === 'default') {
          const exportIdentifier = identifier('__superjsonLocalExport');
          path.insertAfter(exportDefaultDeclaration(exportIdentifier) as any);

          path.insertAfter(
            importDeclaration(
              [importDefaultSpecifier(exportIdentifier)],
              path.node.source
            ) as any
          );

          path.node.specifiers.splice(
            path.node.specifiers.indexOf(specifier),
            1
          );

          if (path.node.specifiers.length === 0) {
            path.remove();
          }
        }
      }
    }
  }
}

function shouldBeSkipped(filePath: string) {
  if (!filePath.includes('pages' + nodePath.sep)) {
    return true;
  }
  if (filePath.includes('pages' + nodePath.sep + 'api' + nodePath.sep)) {
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

        transformImportExportDefault(path.get('body'));

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

        const exportedPageProps = namedExportDeclarations.filter((path) => {
          return path.node.specifiers.some(
            (specifier) =>
              specifier.type === 'ExportSpecifier' &&
              functionsToReplace.includes(specifier.local.name)
          );
        });

        exportedPageProps.forEach((pageProp) => {
          if (!pageProp.node.source?.value) {
            return;
          }

          addNamedImport(
            pageProp as any,
            (pageProp.node.specifiers[0].exported as Identifier).name,
            pageProp.node.source.value
          );
        });

        const containsNextTag = namedExportDeclarations.some((path) => {
          return (
            isVariableDeclaration(path.node.declaration) &&
            path.node.declaration.declarations.some(
              (decl) => isIdentifier(decl.id) && decl.id.name.startsWith('__N_')
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

        if (!transformedOne && !containsNextTag) {
          return;
        }

        wrapExportDefaultDeclaration(exportDefaultDeclaration);
      },
    },
  };
}

export default superJsonWithNext;
