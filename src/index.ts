import { PluginObj, types as t, NodePath } from '@babel/core';
import { addNamed as addNamedImport } from '@babel/helper-module-imports';

function functionDeclarationToExpression(declaration: t.FunctionDeclaration) {
  return t.functionExpression(
    declaration.id,
    declaration.params,
    declaration.body,
    declaration.generator,
    declaration.async
  );
}

function classDeclarationToExpression(declaration: t.ClassDeclaration) {
  return t.classExpression(
    declaration.id,
    declaration.superClass,
    declaration.body,
    declaration.decorators
  );
}

function getFileName(path: NodePath<any>) {
  const { file = {} } = path.hub;

  const { opts = {} } = file;
  const { filename, cwd } = opts as { filename?: string; cwd?: string };
  if (!filename) {
    return undefined;
  }

  if (cwd && filename.startsWith(cwd)) {
    return filename.slice(cwd.length);
  }

  return filename;
}

function transformGetServerSideProps(
  path: NodePath<t.ExportNamedDeclaration>,
  transform: (v: t.Expression) => t.Expression
) {
  const { node } = path;

  if (t.isFunctionDeclaration(node.declaration)) {
    if (node.declaration.id?.name !== 'getServerSideProps') {
      return;
    }

    node.declaration = t.variableDeclaration('const', [
      t.variableDeclarator(
        t.identifier('getServerSideProps'),
        transform(functionDeclarationToExpression(node.declaration))
      ),
    ]);

    return;
  }

  if (t.isVariableDeclaration(node.declaration)) {
    node.declaration.declarations.forEach(declaration => {
      if (
        t.isIdentifier(declaration.id) &&
        declaration.id.name === 'getServerSideProps' &&
        declaration.init
      ) {
        declaration.init = transform(declaration.init);
      }
    });
  }
}

function addWithSuperJSONGSSPImport(path: NodePath<any>) {
  return addNamedImport(
    path,
    'withSuperJSONGSSP',
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

function superJsonWithNext(): PluginObj {
  return {
    name: 'replace gSSP',
    visitor: {
      Program(path) {
        const filename = getFileName(path) ?? 'pages/Default.js';
        if (!filename.includes('pages/')) {
          return;
        }

        let foundGSSP = false;

        path.traverse({
          ExportNamedDeclaration(path) {
            transformGetServerSideProps(path, decl => {
              foundGSSP = true;
              return t.callExpression(addWithSuperJSONGSSPImport(path), [decl]);
            });
          },
        });

        if (foundGSSP) {
          path.traverse({
            ExportDefaultDeclaration(path) {
              function wrapInHOC(expr: t.Expression): t.Expression {
                return t.callExpression(addWithSuperJSONPageImport(path), [
                  expr,
                ]);
              }

              const { node } = path;

              if (t.isIdentifier(node.declaration)) {
                node.declaration = wrapInHOC(node.declaration);
              }

              if (t.isFunctionExpression(node.declaration)) {
                node.declaration = wrapInHOC(node.declaration);
              }

              if (
                t.isFunctionDeclaration(node.declaration) ||
                t.isClassDeclaration(node.declaration)
              ) {
                if (node.declaration.id) {
                  path.insertBefore(node.declaration);
                  node.declaration = wrapInHOC(node.declaration.id);
                } else {
                  if (t.isFunctionDeclaration(node.declaration)) {
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
            },
          });
        }
      },
    },
  };
}

export default superJsonWithNext;