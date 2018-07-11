#!/usr/bin/env node
// @flow

import path from 'path';

import { d3DirTree } from '@cat-org/utils';
import type { d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

import commandLineArgs from 'command-line-args';

const { ignore, showInfo } = ((): {
  ignore: $ReadOnlyArray<string>,
  showInfo: boolean,
} => {
  try {
    return commandLineArgs([
      {
        name: 'ignore',
        alias: 'i',
        type: String,
        multiple: true,
        defaultValue: [],
      },
      {
        name: 'showInfo',
        alias: 's',
        type: Boolean,
        defaultValue: false,
      },
    ]);
  } catch (e) {
    return { ignore: [], showInfo: false };
  }
})();

const packages = d3DirTree(path.resolve(__dirname, '../../packages'), {
  exclude: ignore.map((ignoreText: string): RegExp => new RegExp(ignoreText)),
}).children.map(({ data }: d3DirTreeNodeType): string => data.name);

if (showInfo) {
  console.log(packages.join(' '));
}

export default packages;
