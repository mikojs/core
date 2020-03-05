// @flow

import path from 'path';

import d3DirTree, { type d3DirTreeNodeType } from '../d3DirTree';

it('test d3DirTree', () => {
  expect(
    d3DirTree(path.resolve(__dirname, '..'))
      .children.map(({ data: { name } }: d3DirTreeNodeType) => name)
      .sort(),
  ).toEqual([
    '__tests__',
    'chainingLogger.js',
    'createLogger.js',
    'd3DirTree.js',
    'findRootProcess.js',
    'handleUnhandledRejection.js',
    'index.js',
    'index.js.flow',
    'mockChoice.js',
    'requireModule.js',
    'throwMessageInIndex.js',
  ]);
});
