// @flow

import path from 'path';

import d3DirTree from '../../packages/utils/lib/d3DirTree';
// eslint-disable-next-line max-len
import type { d3DirTreeType } from '../../packages/utils/lib/definitions/d3DirTree.js.flow';

const packages = d3DirTree(path.resolve(__dirname, './../../packages'));

describe('check files in packages', () => {
  packages.children.forEach(({ data, children }: d3DirTreeType) => {
    const { name } = data;

    it(name, () => {
      const files = children
        .map(({ data: childData }: d3DirTreeType): string => childData.name)
        .sort();

      expect(files).toEqual([
        '.npmignore',
        'lib',
        'node_modules',
        'package.json',
        'src',
      ]);
    });
  });
});
