// @flow

import path from 'path';

import dirTree, { type dirTreeNodeType } from '../index';

test('dir tree', () => {
  expect(
    dirTree(path.resolve(__dirname, '..'))
      .children.map(({ data: { name } }: dirTreeNodeType) => name)
      .sort(),
  ).toEqual(['__tests__', 'index.js']);
});
