// @flow

import path from 'path';

export default node => {
  node.data.filePath = path.resolve(node.data.filePath, './index.js');
  node.data.content = `// @flow

export default () => {
  throw new Error('generate by @cat-org/create-cat. Remove this file.');
};`;
};
