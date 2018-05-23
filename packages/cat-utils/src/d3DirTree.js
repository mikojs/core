// @flow

import dirTree from 'directory-tree';
import * as d3 from 'd3-hierarchy';

type dirTreeType = {
  name: string,
  data: mixed,
  children: $ReadOnlyArray<dirTreeType>,
};

export default (filePath: string): dirTreeType => d3
  .hierarchy(dirTree(filePath));
