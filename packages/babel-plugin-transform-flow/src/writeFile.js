// @flow

import fs from 'fs';
import path from 'path';

import mkdirp from 'mkdirp';

import type { flowFileType } from './definitions/index.js.flow';

export default ({
  source,
  targetPath,
  moduleName,
  exportType,
}: flowFileType) => {
  mkdirp.sync(path.dirname(targetPath));

  const content = source
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
  declare module.exports: ${exportType};
}`,
  );
};
