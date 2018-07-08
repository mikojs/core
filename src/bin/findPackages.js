#!/usr/bin/env node
// @flow

import path from 'path';

import commandLineArgs from 'command-line-args';

import d3DirTree from '../../packages/utils/lib/d3DirTree';
import type { d3DirTreeNodeType } from '../../packages/utils/lib/d3DirTree';

const { ignore, showInfo } = commandLineArgs([
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

const packages = d3DirTree(path.resolve(__dirname, '../../packages'), {
  exclude: ignore.map((ignoreText: string): RegExp => new RegExp(ignoreText)),
}).children.map(({ data }: d3DirTreeNodeType): string => data.name);

if (showInfo) {
  console.log(packages.join(' ')); // eslint-disable-line no-console
}

export default packages;
