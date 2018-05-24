// @flow

import path from 'path';

/* eslint-disable-next-line import/no-unresolved */
import { d3DirTree } from 'cat-utils';

const packages = d3DirTree(path.resolve(__dirname, './../packages'))
  .children
  .map(({ data }: {
    data: { name: string },
  }): string => data.name);

if (process.env.NODE_ENV !== 'test') {
  console.log(packages.join(' ')); // eslint-disable-line no-console
}

export default packages;
