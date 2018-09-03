// @flow

import fs from 'fs';
import path from 'path';

import cliOptions from 'utils/cliOptions';
import findFileContent from 'utils/findFileContent';

const getPath = ({ parent, depth, data: { name } }) => {
  if (depth === 0) return ['.'];

  return [...getPath(parent), name];
};

export default node => {
  const relativeFilePath = getPath(node).join('/');
  const filePath = path.resolve(cliOptions.projectDir, relativeFilePath);

  node.data.relativeFilePath = relativeFilePath;
  node.data.filePath = filePath;

  node.data.content = null;
  node.data.fileContent = findFileContent(filePath);
};
