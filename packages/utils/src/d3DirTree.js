// @flow

import typeof dirTreeType from 'directory-tree';
import typeof * as d3Type from 'd3-hierarchy';

import requireModule from './requireModule';

const dirTree: dirTreeType = requireModule('directory-tree');
const d3: d3Type = requireModule('d3-hierarchy');

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

export type d3DirTreeOptionsType = {|
  normalizePath?: (path: string) => boolean,
  exclude?: RegExp | $ReadOnlyArray<RegExp>,
  extensions?: RegExp,
|};

/**
 * @example
 * d3DirTree('/file-path')
 *
 * @param {string} filePath - file path
 * @param {d3DirTreeOptionsType} options - d3 dir tree options
 *
 * @return {d3DirTreeNodeType} - d3 dir tree
 */
export default (
  filePath: string,
  options?: d3DirTreeOptionsType,
): d3DirTreeNodeType => d3.hierarchy(dirTree(filePath, options));
