// @flow

import path from 'path';

import { d3DirTree } from 'cat-utils';

const packages = d3DirTree(path.resolve(__dirname, './../packages'))
  .children
  .map(({ data }) => data.name)

if (process.env.NODE_ENV !== 'test')
  console.log(packages.join(' '));

export default packages;
