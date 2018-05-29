// @flow

import path from 'path';

import commandLineArgs from 'command-line-args';

import d3DirTree from 'cat-utils/lib/d3DirTree';

type dataType = {
  data: { name: string },
};

const { ignore } = commandLineArgs([{
  name: 'ignore',
  alias: 'i',
  type: String,
  multiple: true,
  defaultValue: [],
}]);

const packages = d3DirTree(path.resolve(__dirname, './../packages'))
  .children
  .filter(({ data }: dataType) => !ignore.includes(data.name))
  .map(({ data }: dataType): string => data.name);

/* istanbul ignore if */
if (process.env.NODE_ENV !== 'test') {
  console.log(packages.join(' ')); // eslint-disable-line no-console
}

export default packages;
