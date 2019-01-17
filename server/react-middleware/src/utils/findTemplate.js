// @flow

import fs from 'fs';
import path from 'path';

export default (folderPath: string, name: string) => {
  const componentPath = path.resolve(folderPath, './.templates', name);

  return fs.existsSync(componentPath)
    ? require(componentPath)
    : require(path.resolve(__dirname, '../components/', name));
};
