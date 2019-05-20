// @flow

import { declare } from '@babel/helper-plugin-utils';
import type NodePath from '@babel/traverse';

export default declare(
  (
    api: {| assertVersion: (version: number) => void |},
    { test: pattern = /\.css$/ }: {| test: RegExp |},
  ): {} => {
    api.assertVersion(7);

    return {
      visitor: {
        Identifier: (path: NodePath) => {
          if (
            !path.isIdentifier({ name: 'require' }) ||
            !path.parentPath.isCallExpression() ||
            !pattern.test(path.parentPath.node.arguments[0].value) ||
            path.parentPath.parentPath.isConditionalExpression()
          )
            return;

          path.parentPath.replaceWithSourceString(
            `globalThis.window ? require("${
              path.parentPath.node.arguments[0].value
            }") : {}`,
          );
        },
      },
    };
  },
);
