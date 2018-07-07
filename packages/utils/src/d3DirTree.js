// @flow

import dirTree from 'directory-tree';
import * as d3 from 'd3-hierarchy';

import type {
  d3DirTreeNodeType,
  d3DirTreeOptionsType,
  d3DirTreeType,
} from './definitions/d3DirTree.js.flow';

export default ((
  filePath: string,
  options?: d3DirTreeOptionsType,
): d3DirTreeNodeType =>
  d3.hierarchy(dirTree(filePath, options)): d3DirTreeType);
