// @flow

import dirTree from 'directory-tree';
import * as d3 from 'd3-hierarchy';

// eslint-disable-next-line max-len
import type { d3DirTreeNodeType as _d3DirTreeNodeType } from './definitions/d3DirTree.js.flow';

export type d3DirTreeNodeType = _d3DirTreeNodeType;

export default (
  filePath: string,
  options?: {|
    normalizePath?: (path: string) => string,
    // eslint-disable-next-line flowtype/no-mutable-array
    exclude?: RegExp | Array<RegExp>,
    // eslint-disable-next-line flowtype/no-mutable-array
    extensions?: RegExp,
  |},
): d3DirTreeNodeType => d3.hierarchy(dirTree(filePath, options));
