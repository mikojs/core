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

    /**
     * @example
     * isAddedHotLoader(node)
     *
     * @param {nodePathType} node - node from babel
     *
     * @return {boolean} - if hot loader is added or not
     */
    const isAddedHotLoader = (node: nodePathType) =>
      t.isCallExpression(node) &&
      t.isMemberExpression(node.callee) &&
      t.isCallExpression(node.callee.object) &&
      t.isIdentifier(node.callee.property, { name: 'hot' }) &&
      t.isIdentifier(node.callee.object.callee, {
        name: 'require',
      }) &&
      t.isStringLiteral(node.callee.object.arguments[0], {
        value: 'react-hot-loader/root',
      });

    /**
     * @example
     * addHotLoader(node)
     *
     * @param {nodePathType} node - node from babel
     *
     * @return {nodePathType} - new node to add hot loader
     */
    const addHotLoader = (node: nodePathType) =>
      t.callExpression(
        t.memberExpression(
          t.callExpression(t.identifier('require'), [
            t.stringLiteral('react-hot-loader/root'),
          ]),
          t.identifier('hot'),
        ),
        [
          t.callExpression(
            t.memberExpression(
              t.callExpression(t.identifier('require'), [
                t.stringLiteral('@mikojs/koa-react/lib/utils/getStatic'),
              ]),
              t.identifier('hoistNonReactStaticsHotExported'),
            ),
            [
              node,
              t.binaryExpression(
                '!==',
                t.memberExpression(
                  t.memberExpression(
                    t.identifier('process'),
                    t.identifier('env'),
                  ),
                  t.identifier('NODE_ENV'),
                ),
                t.stringLiteral('production'),
              ),
            ],
          ),
        ],
      );

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

              if (isAddedHotLoader(rootNode.right)) return;

              path.parentPath.parentPath.replaceWith(
                t.assignmentExpression(
                  '=',
                  rootNode.left,
                  addHotLoader(rootNode.right),
                ),
              );
              return;

            default:
              return;
          }
        },
        ExportDefaultDeclaration: (path: nodePathType) => {
          const rootNode = path.node.declaration;

          if (isAddedHotLoader(rootNode)) return;

          path.replaceWith(
            t.exportDefaultDeclaration(addHotLoader(path.node.declaration)),
          );
        },
      },
    };
  },
);
