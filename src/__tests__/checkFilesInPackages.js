// @flow

import path from 'path';

import { d3DirTree } from '@cat-org/utils';
import type { d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

const packageRoot = path.resolve(__dirname, '../../packages');
const packages = d3DirTree(packageRoot, {
  exclude: /node_modules/,
});

describe('check files in packages', () => {
  packages.children.forEach(
    ({ data: { name }, children }: d3DirTreeNodeType) => {
      describe(name, () => {
        const files = children
          .map(
            ({ data: childData }: d3DirTreeNodeType): string => childData.name,
          )
          .sort();

        it('files in package root', () => {
          expect(files).toEqual(['.npmignore', 'lib', 'package.json', 'src']);
        });

        // TODO check packages json key
        // TODO check npm ignore

        switch (name) {
          default:
            break;
        }
      });
    },
  );
});
