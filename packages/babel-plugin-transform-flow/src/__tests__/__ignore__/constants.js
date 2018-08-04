// @flow

import path from 'path';

export const root = path
  .resolve(__dirname, './files')
  .replace(process.cwd(), '.');

export const transformFileOptions = {
  filenames: [`${root}/index.js`],
  outFile: 'lib/index.js',
};

export const transformFolderOptions = {
  filenames: [root],
  outDir: 'lib',
};

export const indexFiles = ['lib/justDefinition.js.flow', 'lib/index.js.flow'];
export const hasFlowFileFiles = ['lib/hasFlowFile.js.flow'];

export default null;
