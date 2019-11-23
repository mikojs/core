// @flow

import nodePath from 'path';

import { declare } from '@babel/helper-plugin-utils';
import type nodePathType from '@babel/traverse';

export default declare(
  (
    { assertVersion, types: t }: nodePathType,
    { test: pattern = /\.css$/ }: {| test: RegExp |},
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
          if (
            !t.isIdentifier(path.node, { name: 'require' }) ||
            !t.isCallExpression(path.parentPath.node) ||
            !pattern.test(path.parentPath.node.arguments[0].value)
          )
            return;

          path.parentPath.replaceWith(
            t.callExpression(path.node, [
              t.conditionalExpression(
                t.memberExpression(
                  t.identifier('globalThis'),
                  t.identifier('window'),
                ),
                t.stringLiteral(path.parentPath.node.arguments[0].value),
                t.stringLiteral(
                  nodePath.relative(
                    nodePath.dirname(filename),
                    nodePath.resolve(__dirname, './emptyCssFile.js'),
                  ),
                ),
              ),
            ]),
          );
        },
      },
    };
  },
);
