// @flow

import fs from 'fs';

export default (filePath: string): string =>
  fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()
    ? fs.readFileSync(filePath, 'utf-8')
    : null;
