import { PluginObj, types } from '@babel/core';

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

function superJsonWithNext(): PluginObj {
  return {
    name: 'replace gSSP',
    visitor: {
      ExportNamedDeclaration(path) {
        const { declaration } = path.node;

        if (!types.isVariableDeclaration(declaration)) {
          return;
        }

        const [{ id, init }] = declaration.declarations;
        if (!types.isIdentifier(id)) {
          return;
        }

        if (id.name !== 'getServerSideProps') {
          return;
        }

        if (
          types.isArrowFunctionExpression(init) ||
          types.isFunctionExpression(init)
        ) {
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

        if (!types.isFunctionDeclaration(declaration)) {
          return;
        }

        if (declaration.params.length === 0) {
          return;
        }

        const [ propsParam ] = declaration.params

        const props = types.identifier("props")

        const deserialization = types.variableDeclaration("let", [
          types.variableDeclarator(
            propsParam,
            types.callExpression(types.identifier('SuperJSON.deserialize'), [
              types.memberExpression(props, types.identifier("SuperJSON")),
            ])
          )
        ])

        declaration.body.body.unshift(deserialization)

        declaration.params[0] = props
      },
    },
  };
}

export default superJsonWithNext;
