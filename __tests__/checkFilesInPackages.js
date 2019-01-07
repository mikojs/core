// @flow

import path from 'path';

import { d3DirTree } from '@cat-org/utils';
import { type d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

describe('check files in packages', () => {
  d3DirTree(path.resolve(__dirname, '../packages'), {
    exclude: [/node_modules/, ...(process.env.TEST_PRODUCTION ? [] : [/lib/])],
  }).children.forEach(
    ({ data: { name, path: filePath }, children }: d3DirTreeNodeType) => {
      describe(name, () => {
        it('files in package root', () => {
          const files = children
            .map(
              ({ data: { name: childName } }: d3DirTreeNodeType): string =>
                childName,
            )
            .filter((folderName: string) => !['templates'].includes(folderName))
            .sort();

          expect(files).toEqual(
            [
              '.npmignore',
              'package.json',
              'README.md',
              'src',
              ...(process.env.TEST_PRODUCTION ? ['lib'] : []),
            ].sort(),
          );
        });

        // TODO check packages json key
        // TODO check npm ignore
        // TODO check pacakges dev not in root package

        switch (name) {
          case 'babel-plugin-transform-flow':
            // TODO check babel version
            break;
          case 'eslint-config-cat':
            // TODO check dependices
            // TODO check eslint version
            break;
          default:
            break;
        }
      });
    },
  );
});
