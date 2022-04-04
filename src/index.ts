import { NodePath, PluginObj, PluginPass, types as t } from '@babel/core';
import { addNamed as addNamedImport } from '@babel/helper-module-imports';
import * as nodePath from 'path';

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
  path: NodePath<t.ExportNamedDeclaration>,
  transform: (v: t.Expression) => t.Expression
): 'found' | undefined {
  const { node } = path;

  if (t.isFunctionDeclaration(node.declaration)) {
    const { id: functionId } = node.declaration;

    if (!functionId) {
      return;
    }

    if (!functionsToReplace.includes(functionId.name)) {
      return;
    }

    node.declaration = t.variableDeclaration('const', [
      t.variableDeclarator(
        functionId,
        transform(functionDeclarationToExpression(node.declaration))
      ),
    ]);

    return 'found';
  }

  if (t.isVariableDeclaration(node.declaration)) {
    for (const declaration of node.declaration.declarations) {
      if (
        t.isIdentifier(declaration.id) &&
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
  function wrapInHOC(expr: t.Expression): t.Expression {
    return t.callExpression(addWithSuperJSONPageImport(path), [expr]);
  }

  const { node } = path;

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
    if (t.isExportNamedDeclaration(path)) {
      for (const specifier of path.node.specifiers) {
        if (specifier.local.name === 'default') {
          const exportIdentifier = t.identifier('__superjsonLocalExport');
          path.insertAfter(t.exportDefaultDeclaration(exportIdentifier) as any);
          path.insertAfter(
            t.importDeclaration(
              [t.importDefaultSpecifier(exportIdentifier)],
              path.node.source
            )
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

export interface SuperJSONPluginOptions {
  exclude?: string[];
}

function superJsonWithNext(): PluginObj {
  return {
    name: 'add superjson to pages with prop getters',
    visitor: {
      Program(path, state) {
        const { exclude: propsToBeExcluded = [] } =
          state.opts as SuperJSONPluginOptions;

        const filePath =
          getFileName(state) ?? nodePath.join('pages', 'Default.js');

        if (shouldBeSkipped(filePath)) {
          return;
        }

        transformImportExportDefault(path.get('body'));

        const body = path.get('body');

        const exportDefaultDeclaration = body.find((path) =>
          t.isExportDefaultDeclaration(path)
        );

        if (!exportDefaultDeclaration) {
          return;
        }

        const namedExportDeclarations = body
          .filter((path) => path.isExportNamedDeclaration())
          .map((path) => path as NodePath<t.ExportNamedDeclaration>);

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

          const specifiers = pageProp.node.specifiers
            .filter((specifier): specifier is t.ExportSpecifier & {
              exported: t.Identifier;
            } => {
              return specifier.exported.type === 'Identifier';
            })
            .map((specifier) => {
              return {
                name: specifier.exported.name,
                path: pageProp as NodePath,
              };
            });

          const declaration = t.importDeclaration(
            specifiers.map((specifier) =>
              t.importSpecifier(
                t.identifier(specifier.name),
                t.identifier(specifier.name)
              )
            ),
            t.stringLiteral(pageProp.node.source.value)
          );

          path.insertBefore(declaration);

          specifiers.forEach((foundExport) => {
            if (!foundExport) {
              return;
            }

            // pageProp as NodePath, specifier.exported.name, ;

            const declaration = t.exportNamedDeclaration(
              t.variableDeclaration('const', [
                t.variableDeclarator(
                  t.identifier(foundExport.name),
                  t.callExpression(addWithSuperJSONPropsImport(path), [
                    t.identifier(foundExport.name),
                  ])
                ),
              ])
            );

            foundExport.path.insertAfter(declaration);
          });

          pageProp.remove();
        });

        const unremovedNamedExportDeclarations = namedExportDeclarations.filter(
          (e) => !e.removed
        );

        const containsNextTag = unremovedNamedExportDeclarations.some(
          (path) => {
            return (
              t.isVariableDeclaration(path.node.declaration) &&
              path.node.declaration.declarations.some(
                (decl) =>
                  t.isIdentifier(decl.id) && decl.id.name.startsWith('__N_')
              )
            );
          }
        );

        let transformedOne = false;
        unremovedNamedExportDeclarations.forEach((path) => {
          const found = transformPropGetters(path, (decl) => {
            return t.callExpression(addWithSuperJSONPropsImport(path), [
              decl,
              t.arrayExpression(
                propsToBeExcluded.map((prop) => t.stringLiteral(prop))
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
