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
  return addNamedImport(path, 'withSuperJSONGSSP', 'superjson-with-next');
}

function addWithSuperJSONPageImport(path: NodePath<any>) {
  return addNamedImport(path, 'withSuperJSONPage', 'superjson-with-next');
}

interface PluginPass {
  withSuperJsonGSSPName?: t.Identifier;
  withSuperJsonPageName?: t.Identifier;
}

function superJsonWithNext(): PluginObj<PluginPass> {
  return {
    name: 'replace gSSP',
    visitor: {
      ExportNamedDeclaration(path, pass) {
        transformGetServerSideProps(path, decl => {
          if (!pass.withSuperJsonGSSPName) {
            pass.withSuperJsonGSSPName = addWithSuperJSONGSSPImport(path);
          }

          return t.callExpression(pass.withSuperJsonGSSPName, [decl]);
        });
      },
      ExportDefaultDeclaration(path, pass) {
        function wrapInHOC(expr: t.Expression): t.Expression {
          if (!pass.withSuperJsonPageName) {
            pass.withSuperJsonPageName = addWithSuperJSONPageImport(path);
          }

          return t.callExpression(pass.withSuperJsonPageName, [expr]);
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
    },
  };
}

export default superJsonWithNext;
