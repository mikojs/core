// @flow

import path from 'path';

import { d3DirTree } from '@cat-org/utils';
import type { d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

const packageRoot = path.resolve(__dirname, '../packages');
const packages = d3DirTree(packageRoot, {
  exclude: [/node_modules/, ...(process.env.TEST_PRODUCTION ? [] : [/lib/])],
});

describe('check files in packages', () => {
  packages.children.forEach(
    ({ data: { name, path: filePath }, children }: d3DirTreeNodeType) => {
      describe(name, () => {
        it('files in package root', () => {
          const files = children
            .map(
              ({ data: { name: childName } }: d3DirTreeNodeType): string =>
                childName,
            )
            .sort();

          expect(files).toEqual(
            [
              '.npmignore',
              'package.json',
              'src',
              ...(process.env.TEST_PRODUCTION ? ['lib'] : []),
            ].sort(),
          );
        });

        // TODO check packages json key
        // TODO check npm ignore
        // TODO check pacakges dev not in root package

        switch (name) {
          case 'eslint-config-cat':
            // TODO check dependices
            break;
          default:
            break;
        }
      });
    },
  );
});
