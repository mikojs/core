// @flow

import nodePath from 'path';

import { declare } from '@babel/helper-plugin-utils';
import type nodePathType from '@babel/traverse';
import outputFileSync from 'output-file-sync';

import { d3DirTree } from '@mikojs/utils';
import {
  type d3DirTreeNodeType,
  type d3DirTreeOptionsType,
} from '@mikojs/utils/lib/d3DirTree';

type optionType = {|
  file: {|
    opts: {| filename: string |},
  |},
|};

export default declare(
  (
    { assertVersion, types: t }: nodePathType,
    {
      dir = '.',
      callback,
      ...options
    }: {|
      ...d3DirTreeOptionsType,
      dir?: string,
      callback: (filenames: $ReadOnlyArray<string>) => string,
    |},
  ): {} => {
    const rootDir = nodePath.resolve(process.cwd(), dir);
    const cacheFilePath = nodePath.resolve(rootDir, './.mergeDir');
    const cache = {};

    /**
     * @param {string} nodeKey - use to find the file path
     * @param {nodePathType} path - babel node path
     * @param {optionType} option - babel option
     */
    const replaceWithCacheFile = (
      nodeKey: string,
      path: nodePathType,
      {
        file: {
          opts: { filename },
        },
      }: optionType,
    ) => {
      const modulePath = nodePath.resolve(
        nodePath.dirname(filename),
        path.get(nodeKey).node.value,
      );

      if (modulePath !== rootDir) {
        if (modulePath.includes(rootDir)) path.remove();
        return;
      }

      path
        .get(nodeKey)
        .replaceWith(
          t.stringLiteral(
            nodePath.relative(nodePath.dirname(filename), cacheFilePath),
          ),
        );
    };

    assertVersion(7);
    d3DirTree(rootDir, options)
      .leaves()
      .forEach(({ data: { path: filename } }: d3DirTreeNodeType) => {
        cache[filename] = filename;
      });
    outputFileSync(cacheFilePath, callback?.(Object.values(cache)) || '');

    return {
      visitor: {
        ImportDeclaration: (path: nodePathType, option: optionType) => {
          replaceWithCacheFile('source', path, option);
        },

        CallExpression: (path: nodePathType, option: optionType) => {
          if (!t.isIdentifier(path.get('callee').node, { name: 'require' }))
            return;

          replaceWithCacheFile('arguments.0', path, option);
        },
      },
      post: ({ opts: { filename } }: $PropertyType<optionType, 'file'>) => {
        if (!filename.includes(rootDir)) return;

        cache[filename] = filename;
        outputFileSync(cacheFilePath, callback?.(Object.values(cache)) || '');
      },
    };
  },
);
