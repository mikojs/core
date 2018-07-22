// @flow

import path from 'path';

import d3DirTree from '../d3DirTree';

import type { d3DirTreeNodeType } from '../definitions/d3DirTree.js.flow';

it('test d3DirTree', () => {
  expect(
    d3DirTree(path.resolve(__dirname, '..'))
      .children.map(({ data: { name } }: d3DirTreeNodeType): string => name)
      .sort(),
  ).toEqual([
    '__tests__',
    'd3DirTree.js',
    'definitions',
    'index.js',
    'throwMessageInIndex.js',
  ]);
});
