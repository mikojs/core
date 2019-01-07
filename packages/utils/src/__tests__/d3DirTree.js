// @flow

import path from 'path';

import d3DirTree, { type d3DirTreeNodeType } from '../d3DirTree';

it('test d3DirTree', () => {
  expect(
    d3DirTree(path.resolve(__dirname, '..'))
      .children.map(({ data: { name } }: d3DirTreeNodeType): string => name)
      .sort(),
  ).toEqual([
    '__tests__',
    'd3DirTree.js',
    'handleUnhandledRejection.js',
    'index.js',
    'index.js.flow',
    'mockChoice.js',
    'normalizedQuestions.js',
    'throwMessageInIndex.js',
  ]);
});
