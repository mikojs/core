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
        Identifier: (path: nodePathType) => {
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
                  // eslint-disable-next-line new-cap
                  t.Identifier('globalThis'),
                  // eslint-disable-next-line new-cap
                  t.Identifier('window'),
                ),
                // eslint-disable-next-line new-cap
                t.StringLiteral(path.parentPath.node.arguments[0].value),
                // eslint-disable-next-line new-cap
                t.StringLiteral(
                  nodePath.resolve(__dirname, './emptyCssFile.js'),
                ),
              ),
            ]),
          );
        },
      },
    };
  },
);
