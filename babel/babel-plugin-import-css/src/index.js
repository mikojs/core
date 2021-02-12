// @flow

import nodePath from 'path';

import { declare } from '@babel/helper-plugin-utils';
import typeof nodePathType from '@babel/traverse';

export default (declare(
  (
    { assertVersion, types: t }: nodePathType,
    { test: pattern = /\.css$/ }: {| test: RegExp |},
  ): $Call<typeof declare> => {
    assertVersion(7);

    return {
      visitor: {
        /**
         * @param {nodePathType} path - babel path
         * @param {object} options - babel options
         * @param {object} options.file - babel file options
         * @param {object} options.file.opts - babel opts options
         * @param {string} options.file.opts.filename - babel filename option
         */
        CallExpression: (
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
            !t.isIdentifier(path.get('callee').node, { name: 'require' }) ||
            !pattern.test(path.get('arguments.0').node.value)
          )
            return;

          path
            .get('arguments.0')
            .replaceWith(
              t.conditionalExpression(
                t.memberExpression(
                  t.identifier('globalThis'),
                  t.identifier('window'),
                ),
                t.stringLiteral(path.get('arguments.0').node.value),
                t.stringLiteral(
                  nodePath.relative(
                    nodePath.dirname(filename),
                    nodePath.resolve(__dirname, './emptyCssFile.js'),
                  ),
                ),
              ),
            );
        },
      },
    };
  },
): $Call<typeof declare>);
