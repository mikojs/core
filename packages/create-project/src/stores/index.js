// @flow

import path from 'path';

import chalk from 'chalk';
import { emptyFunction } from 'fbjs';
import outputFileSync from 'output-file-sync';
import execa from 'execa';
import debug from 'debug';

import logger from 'utils/logger';

export type pkgType = {
  [string]: string,
  husky: {
    hooks: {
      [string]: string,
    },
  },
  engines?: {
    [string]: string,
  },
  private?: boolean,
};

export type ctxType = {
  projectDir: string,
  cmd: string,
  pkg?: pkgType,
};

const debugLog = debug('create-project:store');

/** default store */
export default class Store {
  ctx: ctxType;

  subStores = [];

  start = emptyFunction;

  end = emptyFunction;

  /**
   * not overwrite
   *
   * @example
   * store.run(ctx)
   *
   * @param {Object} ctx - store context
   */
  run = async (ctx: ctxType): Promise<$ReadOnlyArray<Store>> => {
    const stores = [];

    this.ctx = ctx;
    await this.start(ctx);
    debugLog({
      name: this.constructor.name,
      subStores: this.subStores,
    });

    for (const store of this.subStores) stores.concat(await store.run(ctx));

    return [...this.subStores, ...stores];
  };

  /**
   * @example
   * store.writeFiles({ 'path': 'test' })
   *
   * @param {Object} files - files object
   */
  writeFiles = (files: { [string]: string }) => {
    const { projectDir } = this.ctx;

    Object.keys(files).forEach((key: string) => {
      const writeFile = [path.resolve(projectDir, key), files[key]];

      outputFileSync(...writeFile);
      debugLog(writeFile);
    });
  };

  /**
   * @example
   * store.execa('command')
   *
   * @param {Array} commands - commands array
   */
  execa = async (...commands: $ReadOnlyArray<string>): Promise<void> => {
    const { projectDir } = this.ctx;

    try {
      for (const command of commands) {
        logger.info(chalk`Run command: {green ${command}}`);
        await execa.shell(command, {
          cwd: projectDir,
          stdio: 'inherit',
        });
      }
    } catch (e) {
      debugLog(e);
    }
  };
}
