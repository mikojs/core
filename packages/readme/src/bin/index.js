#! /usr/bin/env node
// @flow

import fs from 'fs';
import path from 'path';

import readPkgUp from 'read-pkg-up';
import unified from 'unified';
import markdown from 'remark-parse';
import execa from 'execa';
import debug from 'debug';

import { handleUnhandledRejection } from '@cat-org/utils';

import logger from 'utils/logger';
import compiler from 'utils/compiler';

const debugLog = debug('readme:bin');

handleUnhandledRejection();

(async (): Promise<void> => {
  const { path: pkgPath, pkg } = await readPkgUp();

  if (!pkgPath) logger.fail('Can not find the root path');

  const rootPath = path.dirname(pkgPath);
  const readmePath = path.resolve(rootPath, 'README.md');
  const processor = unified().use(markdown);
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

  processor.Compiler = compiler(ctx);
  processor.process(
    fs.existsSync(readmePath) ? fs.readFileSync(readmePath, 'utf-8') : '',
    (err: mixed, { contents }: { contents: string }) => {
      if (err) {
        debugLog(err);
        logger.fail('Parser file error');
      }

      // TODO
      const { log } = console;
      log(contents);
    },
  );
})();
