// @flow

import path from 'path';

import commandLineArgs from 'command-line-args';

/* eslint-disable-next-line import/no-unresolved */
import d3DirTree from 'cat-utils/lib/d3DirTree';

type dataType = {
  data: { name: string },
};

const ENV = process.env.NODE_ENV;
const { ignore } = (
  ENV === 'test' ?
    { ignore: [] } :
    commandLineArgs([{
      name: 'ignore',
      alias: 'i',
      type: String,
      multiple: true,
      defaultValue: [],
    }])
);

const packages = d3DirTree(path.resolve(__dirname, './../packages'))
  .children
  .filter(({ data }: dataType): boolean => !ignore.includes(data.name))
  .map(({ data }: dataType): string => data.name);

/* istanbul ignore if */
if (ENV !== 'test') {
  console.log(packages.join(' ')); // eslint-disable-line no-console
}

export default packages;
