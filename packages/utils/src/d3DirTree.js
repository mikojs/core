// @flow

import dirTree from 'directory-tree';
import * as d3 from 'd3-hierarchy';

// eslint-disable-next-line import/group-exports
export type d3DirTreeNodeType = {|
  data: {|
    path: string,
    name: string,
    size: number,
    type: 'directory' | 'file',
    extension: mixed,
  |},
  depth: number,
  height: number,
  parent?: d3DirTreeNodeType,
  children: $ReadOnlyArray<d3DirTreeNodeType>,

  /* function */
  each: (callback: (node: d3DirTreeNodeType) => void) => void,
  leaves: () => $ReadOnlyArray<d3DirTreeNodeType>,
|};

// eslint-disable-next-line import/group-exports
export type d3DirTreeOptionsType = {|
  normalizePath?: (path: string) => boolean,
  exclude?: RegExp | $ReadOnlyArray<RegExp>,
  extensions?: RegExp,
|};

export default (
  filePath: string,
  options?: d3DirTreeOptionsType,
): d3DirTreeNodeType => d3.hierarchy(dirTree(filePath, options));
