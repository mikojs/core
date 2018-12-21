#! /usr/bin/env node
// @flow

import fs from 'fs';
import path from 'path';

import readPkgUp from 'read-pkg-up';
import execa from 'execa';
import debug from 'debug';

import { handleUnhandledRejection } from '@cat-org/utils';

import logger from 'utils/logger';
import parser from 'utils/parser';

const debugLog = debug('readme:bin');

handleUnhandledRejection();

(async (): Promise<void> => {
  const { path: pkgPath, pkg } = await readPkgUp();

  if (!pkgPath) logger.fail('Can not find the root path');

  const rootPath = path.dirname(pkgPath);
  const readmePath = path.resolve(rootPath, 'README.md');
  const ctx = {
    rootPath,
    pkg,
    repo: {
      username: 'username',
      projectName: 'projectName',
    },
  };

  try {
    const { stdout } = await execa.shell('git remote -v');
    const [username, projectName] = stdout
      .replace(/origin\t.*@.*:(.*).git \(fetch\)(.|\n)*/, '$1')
      .split('/');

    ctx.repo = {
      username,
      projectName,
    };
  } catch (e) {
    debugLog(e);
    logger.fail('Can not find git remote');
  }

  const content = await parser(
    fs.existsSync(readmePath) ? fs.readFileSync(readmePath, 'utf-8') : '',
    ctx,
  );

  // TODO
  const { log } = console;
  log(content);
})();
