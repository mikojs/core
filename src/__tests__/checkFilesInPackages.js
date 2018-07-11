// @flow

import path from 'path';

import { d3DirTree } from '@cat-org/utils';
import type { d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

import pkg from '../../package.json';

const packageRoot = path.resolve(__dirname, '../../packages');
const packages = d3DirTree(packageRoot, {
  exclude: [/node_modules/, ...(process.env.TEST_PRODUCTION ? [] : [/lib/])],
});
const flowVersion = pkg.devDependencies['flow-bin'].replace(/\^/, '');

describe('check files in packages', () => {
  packages.children.forEach(
    ({ data: { name, path: filePath }, children }: d3DirTreeNodeType) => {
      describe(name, () => {
        const files = children
          .map(
            ({ data: childData }: d3DirTreeNodeType): string => childData.name,
          )
          .sort();

        it('files in package root', () => {
          expect(files).toEqual(['.npmignore', 'package.json', 'src']);
        });

        it('check flow version', () => {
          expect(
            require(path.resolve(filePath, './package.json')).scripts[
              'flow-typed'
            ],
          ).toMatch(new RegExp(flowVersion));
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
