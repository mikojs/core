// @flow

import path from 'path';

import { d3DirTree } from 'cat-utils';

console.log(
  d3DirTree(path.resolve(__dirname, './../packages'))
    .children
    .map(({ data }) => data.name)
    .join(' ')
);
