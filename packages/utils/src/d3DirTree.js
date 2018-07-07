// @flow

import dirTree from 'directory-tree';
import * as d3 from 'd3-hierarchy';

import type {
  d3DirTreeNodeType as _d3DirTreeNodeType,
  d3DirTreeOptionsType as _d3DirTreeOptionsType,
  d3DirTreeType as _d3DirTreeType,
} from './definitions/d3DirTree.js.flow';

/* eslint-disable import/group-exports */
export type d3DirTreeNodeType = _d3DirTreeNodeType;
export type d3DirTreeOptionsType = _d3DirTreeOptionsType;
export type d3DirTreeType = _d3DirTreeType;
/* eslint-enable import/group-exports */

export default ((
  filePath: string,
  options?: d3DirTreeOptionsType,
): d3DirTreeNodeType =>
  d3.hierarchy(dirTree(filePath, options)): d3DirTreeType);
