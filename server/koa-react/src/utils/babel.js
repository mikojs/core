// @flow

import nodePath from 'path';

import { declare } from '@babel/helper-plugin-utils';
import type nodePathType from '@babel/traverse';

import type CacheType from './Cache';

const templateFolder = nodePath.resolve(__dirname, '../templates');

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
          if (
            !t.isIdentifier(path.node, { name: 'require' }) ||
            !t.isCallExpression(path.parentPath.node)
          )
            return;

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
            // eslint-disable-next-line new-cap
            t.callExpression(path.node, [t.StringLiteral(newTemplatePath)]),
          );
        },
      },
    };
  },
);
