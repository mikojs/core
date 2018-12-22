// @flow

import fs from 'fs';
import path from 'path';

import type { ctxType } from '.';

export default ({ rootPath }: ctxType): ?string => {
  if (!fs.existsSync(path.resolve(rootPath, './CHANGELOG.md'))) return null;

  return `## Changelog

If you want to find the differences between the versions, you can see the [CHANGELOG.md](./CHANGELOG.md) file for details.`;
};
