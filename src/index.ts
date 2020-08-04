import { PluginObj, types as t, NodePath } from '@babel/core';
import { addDefault as addDefaultImport } from '@babel/helper-module-imports';

function transformReturnValue(
  value: t.Expression,
  superjsonIdentifier: t.Identifier
): t.Expression {
  const returnValueIdentifier = t.identifier('r');
  const propsOfR = t.memberExpression(
    returnValueIdentifier,
    t.identifier('props')
  );
  const body = t.conditionalExpression(
    propsOfR,
    t.sequenceExpression([
      t.assignmentExpression(
        '=',
        propsOfR,
        t.callExpression(
          t.memberExpression(superjsonIdentifier, t.identifier('serialize')),
          [propsOfR]
        )
      ),
      returnValueIdentifier,
    ]),
    returnValueIdentifier
  );

  const creatorFunction = t.arrowFunctionExpression(
    [returnValueIdentifier],
    body
  );

  return t.callExpression(t.parenthesizedExpression(creatorFunction), [value]);
}

function transformPageFunctionComponent<
  T extends t.FunctionDeclaration | t.ClassMethod
>(func: T, superJsonIdentifier: t.Identifier): T {
  if (func.params.length === 0) {
    return func;
  }

  const newPropsParamIdentifier = t.identifier('props');

  const {
    params,
    body: { body },
  } = func;

  const [oldPropsParam] = params;
  params[0] = newPropsParamIdentifier;

  const deserializationLine = t.variableDeclaration('let', [
    t.variableDeclarator(
      oldPropsParam,
      t.callExpression(
        t.memberExpression(superJsonIdentifier, t.identifier('deserialize')),
        [t.memberExpression(newPropsParamIdentifier, t.identifier('SuperJSON'))]
      )
    ),
  ]);

  body.unshift(deserializationLine);

  return func;
}

function transformPageClassComponent(
  component: t.ClassDeclaration,
  superJsonIdentifier: t.Identifier
): t.ClassDeclaration {
  function isRenderFunction(decl: typeof component.body.body[0]): boolean {
    return (
      t.isClassMethod(decl) &&
      t.isIdentifier(decl.key) &&
      decl.key.name === 'render'
    );
  }

  component.body.body = component.body.body.map(decl => {
    if (isRenderFunction(decl)) {
      return transformPageFunctionComponent(decl as t.ClassMethod, superJsonIdentifier);
    }

    return decl;
  });

  return component;
}

function isGetServerSidePropsDeclaration(
  path: NodePath<t.ExportNamedDeclaration>
): boolean {
  const { declaration } = path.node;

  if (!t.isVariableDeclaration(declaration)) {
    return false;
  }

  const [{ id, init }] = declaration.declarations;
  if (!t.isIdentifier(id)) {
    return false;
  }

  if (id.name !== 'getServerSideProps') {
    return false;
  }

  return t.isArrowFunctionExpression(init) || t.isFunctionExpression(init);
}

function addSuperJSONImport(path: NodePath<any>) {
  return addDefaultImport(path, "superjson", {
    nameHint: 'SuperJSON',
  });
}

interface PluginPass {
  superJsonName?: t.Identifier;
}

function superJsonWithNext(): PluginObj<PluginPass> {
  return {
    name: 'replace gSSP',
    visitor: {
      ExportNamedDeclaration(path, pass) {
        if (isGetServerSidePropsDeclaration(path)) {
          path.traverse({
            ReturnStatement(path) {
              if (!pass.superJsonName) {
                pass.superJsonName = addSuperJSONImport(path);
              }

              if (path.node.argument) {
                path.node.argument = transformReturnValue(path.node.argument, pass.superJsonName);
              }
            },
          });
        }
      },
      ExportDefaultDeclaration(path, pass) {
        const { declaration } = path.node;

        if (t.isFunctionDeclaration(declaration)) {
          path.node.declaration = transformPageFunctionComponent(declaration, pass.superJsonName!);
        }

        if (t.isClassDeclaration(declaration)) {
          path.node.declaration = transformPageClassComponent(declaration, pass.superJsonName!);
        }
      },
    },
  };
}

export default superJsonWithNext;
