// @flow

import outputFileSync from 'output-file-sync';

export default ({ data: { filePath, output } }) => {
  if (output) outputFileSync(filePath, output);
};
