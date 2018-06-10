// @flow

import path from 'path';

import commandLineArgs from 'command-line-args';

import d3DirTree from '../packages/cat-utils/lib/d3DirTree';

type dataType = {
  data: { name: string },
};

const { ignore, showInfo } = commandLineArgs([{
  name: 'ignore',
  alias: 'i',
  type: String,
  multiple: true,
  defaultValue: [],
}, {
  name: 'showInfo',
  alias: 's',
  type: Boolean,
  defaultValue: false,
}]);

const packages = d3DirTree(path.resolve(__dirname, './../packages'))
  .children
  .filter(({ data }: dataType): boolean => !ignore.includes(data.name))
  .map(({ data }: dataType): string => data.name);

if (showInfo) {
  console.log(packages.join(' ')); // eslint-disable-line no-console
}

export default packages;
