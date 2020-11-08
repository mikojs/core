// @flow

import dirTree from 'directory-tree';
import * as d3 from 'd3-hierarchy';

export type dirTreeNodeType = {|
  data: {|
    path: string,
    name: string,
    size: number,
    type: 'directory' | 'file',
    extension: string,
  |},
  depth: number,
  height: number,
  parent?: dirTreeNodeType,
  children: $ReadOnlyArray<dirTreeNodeType>,
  each: (callback: (node: dirTreeNodeType) => void) => void,
  leaves: () => $ReadOnlyArray<dirTreeNodeType>,
|};

export type optionsType = {|
  normalizePath?: (path: string) => boolean,
  exclude?: RegExp | $ReadOnlyArray<RegExp>,
  extensions?: RegExp,
|};

/**
 * @param {string} filePath - file path
 * @param {optionsType} options - dir tree options
 *
 * @return {dirTreeNodeType} - dir tree
 */
export default (filePath: string, options?: optionsType): dirTreeNodeType =>
  d3.hierarchy(dirTree(filePath, options));
