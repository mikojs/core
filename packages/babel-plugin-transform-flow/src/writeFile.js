// @flow

import fs from 'fs';
import path from 'path';

import mkdirp from 'mkdirp';

export default ({ sourcePath, targetPath, moduleName }) => {
  mkdirp.sync(path.dirname(targetPath));

  const content = fs
    .readFileSync(sourcePath, 'utf-8')
    .replace(/\/\/ @flow\n\n/, '')
    .split(/\n/)
    .map(
      (text: string): string =>
        text === '' ? '' : `  ${text.replace(/export/g, 'declare')}`,
    )
    .join('\n');

  fs.writeFileSync(
    targetPath,
    `/**
 * Build files by @cat-org/babel-plugin-transform-flow
 */

declare module "${moduleName}" {
${content}
  declare module.exports: ${moduleName.split(/\//).slice(-1)[0]}Type;
}`,
  );
};
