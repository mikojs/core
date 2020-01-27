#! /usr/bin/env node
// @flow

import fs from 'fs';
import path from 'path';

import outputFileSync from 'output-file-sync';

import { handleUnhandledRejection, requireModule } from '@mikojs/utils';

import cliOptions from 'utils/cliOptions';
import getPkg from 'utils/getPkg';

import license from 'templates/license';

handleUnhandledRejection();

(async () => {
  const projectDir = await cliOptions(process.argv);

  if (!projectDir) return;

  const pkgPath = path.resolve(projectDir, './package.json');
  const pkgContent = await getPkg(
    projectDir,
    fs.existsSync(pkgPath) ? requireModule(pkgPath) : {}
  );

  [
    {
      filePath: pkgPath,
      content: JSON.stringify(pkgContent, null, 2),
    },
    {
      filePath: path.resolve(projectDir, 'LICENSE'),
      content: license(pkgContent.author),
    },
  ].forEach(({ filePath, content }: {| filePath: string, content: string |}) => {
    outputFileSync(filePath, content);
  });
})();
