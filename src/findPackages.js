// @flow

import path from 'path';

import d3DirTree from 'cat-utils/lib/d3DirTree';

const packages = d3DirTree(path.resolve(__dirname, './../packages'))
  .children
  .map(({ data }: {
    data: { name: string },
  }): string => data.name);

/* istanbul ignore if */
if (process.env.NODE_ENV !== 'test') {
  console.log(packages.join(' ')); // eslint-disable-line no-console
}

export default packages;
