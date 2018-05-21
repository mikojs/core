// @flow

import dirTree from 'directory-tree';
import * as d3 from 'd3-hierarchy';

export default (filePath: string) => d3.hierarchy(dirTree(filePath));
