#!/usr/bin/env node
// @flow

import path from 'path';

import commandLineArgs from 'command-line-args';

import d3DirTree from '../../packages/utils/lib/d3DirTree';

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
})
  .children.filter(
    ({ data }: d3DirTree): boolean => !ignore.includes(data.name),
  )
  .map(({ data }: d3DirTree): string => data.name);

if (showInfo) {
  console.log(packages.join(' ')); // eslint-disable-line no-console
}

export default packages;
