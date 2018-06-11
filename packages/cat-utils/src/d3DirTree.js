// @flow

import dirTree from 'directory-tree';
import * as d3 from 'd3-hierarchy';

import type { d3DirTreeType } from './definitions/d3DirTree.js.flow';

export default (filePath: string): d3DirTreeType => d3
  .hierarchy(dirTree(filePath));
