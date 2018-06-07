// @flow

import dirTree from 'directory-tree';
import * as d3 from 'd3-hierarchy';

import type dirTreeType from './definitions/d3DirTree.js.flow';

export default (filePath: string): dirTreeType => d3
  .hierarchy(dirTree(filePath));
