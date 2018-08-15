// @flow

import * as d3 from 'd3-hierarchy';

const transformConfig = config =>
  config.reduce(
    (result, [parent, childData]) => [
      ...result,
      ...childData.map(name => ({
        name,
        parent,
      })),
    ],
    [{ name: 'root', parent: '' }],
  );

const getTreeStructure = d3
  .stratify()
  .id(({ name }) => name)
  .parentId(({ parent }) => parent);

export default config => getTreeStructure(transformConfig(config)).leaves();
