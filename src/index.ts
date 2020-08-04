import { PluginObj, types, NodePath } from '@babel/core';

function transformReturnValue(value: types.Expression): types.Expression {
  const returnValueIdentifier = types.identifier('r');
  const propsOfR = types.memberExpression(
    returnValueIdentifier,
    types.identifier('props')
  );
  const body = types.conditionalExpression(
    propsOfR,
    types.sequenceExpression([
      types.assignmentExpression(
        '=',
        propsOfR,
        types.callExpression(types.identifier('SuperJSON.serialize'), [
          propsOfR,
        ])
      ),
      returnValueIdentifier,
    ]),
    returnValueIdentifier
  );

  const creatorFunction = types.arrowFunctionExpression(
    [returnValueIdentifier],
    body
  );

  return types.callExpression(types.parenthesizedExpression(creatorFunction), [
    value,
  ]);
}

function transformPageFunctionComponent<
  T extends types.FunctionDeclaration | types.ClassMethod
>(func: T): T {
  if (func.params.length === 0) {
    return func;
  }

  const newPropsParamIdentifier = types.identifier('props');

  const {
    params,
    body: { body },
  } = func;

  const [oldPropsParam] = params;
  params[0] = newPropsParamIdentifier;

  const deserializationLine = types.variableDeclaration('let', [
    types.variableDeclarator(
      oldPropsParam,
      types.callExpression(types.identifier('SuperJSON.deserialize'), [
        types.memberExpression(newPropsParamIdentifier, types.identifier('SuperJSON')),
      ])
    ),
  ]);

  body.unshift(deserializationLine);

  return func;
}

function transformPageClassComponent(
  component: types.ClassDeclaration
): types.ClassDeclaration {
  function isRenderFunction(decl: typeof component.body.body[0]): boolean {
    return (
      types.isClassMethod(decl) &&
      types.isIdentifier(decl.key) &&
      decl.key.name === 'render'
    );
  }

  component.body.body = component.body.body.map(decl => {
    if (isRenderFunction(decl)) {
      return transformPageFunctionComponent(decl as types.ClassMethod);
    }

    return decl;
  });

  return component;
}

function isGetServerSidePropsDeclaration(
  path: NodePath<types.ExportNamedDeclaration>
): boolean {
  const { declaration } = path.node;

  if (!types.isVariableDeclaration(declaration)) {
    return false;
  }

  const [{ id, init }] = declaration.declarations;
  if (!types.isIdentifier(id)) {
    return false;
  }

  if (id.name !== 'getServerSideProps') {
    return false;
  }

  return (
    types.isArrowFunctionExpression(init) || types.isFunctionExpression(init)
  );
}

function superJsonWithNext(): PluginObj {
  return {
    name: 'replace gSSP',
    visitor: {
      ExportNamedDeclaration(path) {
        if (isGetServerSidePropsDeclaration(path)) {
          path.traverse({
            ReturnStatement(path) {
              if (path.node.argument) {
                path.node.argument = transformReturnValue(path.node.argument);
              }
            },
          });
        }
      },
      ExportDefaultDeclaration(path) {
        const { declaration } = path.node;

        if (types.isFunctionDeclaration(declaration)) {
          path.node.declaration = transformPageFunctionComponent(declaration);
        }

        if (types.isClassDeclaration(declaration)) {
          path.node.declaration = transformPageClassComponent(declaration);
        }
      },
    },
  };
}

export default superJsonWithNext;
