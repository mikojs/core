#! /usr/bin/env node
// @flow

import fs from 'fs';
import path from 'path';

import readPkgUp from 'read-pkg-up';
import unified from 'unified';
import markdown from 'remark-parse';
import debug from 'debug';

import { handleUnhandledRejection } from '@cat-org/utils';

import logger from 'utils/logger';
import compiler from 'utils/compiler';

const debugLog = debug('readme:bin');

handleUnhandledRejection();

(async (): Promise<void> => {
  const { path: pkgPath } = await readPkgUp();

  if (!pkgPath) logger.fail('Can not find the root path');

  const readmePath = path.resolve(path.dirname(pkgPath), 'README.md');
  const processor = unified().use(markdown);

  processor.Compiler = compiler;
  processor.process(
    fs.existsSync(readmePath) ? fs.readFileSync(readmePath, 'utf-8') : '',
    (err: mixed, content: string) => {
      if (err) {
        debugLog(err);
        logger.fail('Parser file error');
      }

      // TODO
      const { log } = console;
      log(content);
    },
  );
})();
