// @flow

import nodePath from 'path';

import { declare } from '@babel/helper-plugin-utils';
import type nodePathType from '@babel/traverse';

import type CacheType from './Cache';

export default declare(
  (
    { assertVersion, types: t }: nodePathType,
    { cacheDir }: { cacheDir: $PropertyType<CacheType, 'cacheDir'> },
  ): {} => {
    assertVersion(7);

    return {
      visitor: {
        Identifier: (
          path: nodePathType,
          {
            file: {
              opts: { filename },
            },
          }: {|
            file: {|
              opts: {| filename: string |},
            |},
          |},
        ) => {
          switch (path.node.name) {
            case 'require': {
              if (!t.isCallExpression(path.parentPath.node)) return;

              const templateFolder = nodePath.resolve(
                __dirname,
                '../templates',
              );
              const currentTemplatePath = nodePath.resolve(
                nodePath.dirname(filename),
                path.parentPath.node.arguments[0].value,
              );

              if (!currentTemplatePath.match(templateFolder)) return;

              const newTemplatePath = cacheDir(
                nodePath.relative(templateFolder, currentTemplatePath),
              );

              if (currentTemplatePath === newTemplatePath) return;

              path.parentPath.replaceWith(
                t.callExpression(path.node, [t.stringLiteral(newTemplatePath)]),
              );
              return;
            }

            case 'module':
              if (
                !t.isMemberExpression(path.parentPath.node) ||
                !t.isIdentifier(path.parentPath.node.property, {
                  name: 'exports',
                }) ||
                !t.isAssignmentExpression(path.parentPath.parentPath.node)
              )
                return;

              const rootNode = path.parentPath.parentPath.node;

              if (
                t.isCallExpression(rootNode.right) &&
                t.isMemberExpression(rootNode.right.callee) &&
                t.isCallExpression(rootNode.right.callee.object) &&
                t.isIdentifier(rootNode.right.callee.property, {
                  name: 'hot',
                }) &&
                t.isIdentifier(rootNode.right.callee.object.callee, {
                  name: 'require',
                }) &&
                t.isStringLiteral(rootNode.right.callee.object.arguments[0], {
                  value: 'react-hot-loader/root',
                })
              )
                return;

              path.parentPath.parentPath.replaceWith(
                t.assignmentExpression(
                  '=',
                  rootNode.left,
                  t.callExpression(
                    t.memberExpression(
                      t.callExpression(t.identifier('require'), [
                        t.stringLiteral('react-hot-loader/root'),
                      ]),
                      t.identifier('hot'),
                    ),
                    [rootNode.right],
                  ),
                ),
              );
              return;

            default:
              return;
          }
        },
        ExportDefaultDeclaration: (path: nodePathType) => {
          const rootNode = path.node.declaration;

          if (
            t.isCallExpression(rootNode) &&
            t.isMemberExpression(rootNode.callee) &&
            t.isCallExpression(rootNode.callee.object) &&
            t.isIdentifier(rootNode.callee.property, { name: 'hot' }) &&
            t.isIdentifier(rootNode.callee.object.callee, {
              name: 'require',
            }) &&
            t.isStringLiteral(rootNode.callee.object.arguments[0], {
              value: 'react-hot-loader/root',
            })
          )
            return;

          path.replaceWith(
            t.exportDefaultDeclaration(
              t.callExpression(
                t.memberExpression(
                  t.callExpression(t.identifier('require'), [
                    t.stringLiteral('react-hot-loader/root'),
                  ]),
                  t.identifier('hot'),
                ),
                [path.node.declaration],
              ),
            ),
          );
        },
      },
    };
  },
);
