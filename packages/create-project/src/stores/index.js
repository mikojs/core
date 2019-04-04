// @flow

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import { emptyFunction } from 'fbjs';
import inquirer from 'inquirer';
import outputFileSync from 'output-file-sync';
import execa from 'execa';
import debug from 'debug';

import logger from 'utils/logger';
import checkFiles from 'utils/checkFiles';
import checkCommands from 'utils/checkCommands';

type pkgType = {
  [string]: string,
  husky: {|
    hooks: {
      [string]: string,
    },
  |},
  author?: string,
  engines?: {
    [string]: string,
  },
  private?: boolean,
  scripts: {
    [string]: string,
  },
};

type ctxType = {|
  projectDir: string,
  check: boolean,
  pkg?: pkgType,
  useNpm?: boolean,
|};

const debugLog = debug('create-project:store');

/** default store */
export default class Store {
  ctx: ctxType;

  cachePath: string;

  subStores = [];

  start = emptyFunction;

  end = emptyFunction;

  /**
   * @example
   * store.run(ctx)
   *
   * @param {Object} ctx - store context
   */
  run = async (ctx: ctxType): Promise<$ReadOnlyArray<Store>> => {
    const stores = [];
    const { projectDir } = ctx;

    this.ctx = ctx;
    this.cachePath = path.resolve(projectDir, '.cat-lock');

    await this.start(ctx);
    debugLog({
      name: this.constructor.name,
      subStores: this.subStores,
    });

    for (const store of this.subStores) stores.push(...(await store.run(ctx)));

    return [...this.subStores, ...stores];
  };

  /**
   * @example
   * store.getCache()
   *
   * @return {Object} - cache
   */
  getCache = () =>
    !fs.existsSync(this.cachePath)
      ? {}
      : JSON.parse(fs.readFileSync(this.cachePath, 'utf-8'));

  /**
   * @example
   * store.writeCach({})
   *
   * @param {Object} data - cache data
   */
  writeCache = (data: {}) => {
    outputFileSync(
      this.cachePath,
      JSON.stringify(
        {
          ...this.getCache(),
          ...data,
        },
        null,
        2,
      ),
    );
  };

  /**
   * @example
   * store.prompt([])
   *
   * @param {Array} argus - prompt array
   */
  prompt = async <T>(
    ...argus: $ReadOnlyArray<T>
  ): Promise<{
    [string]: *,
  }> => {
    const { check } = this.ctx;
    const promptName = `${this.constructor.name}-prompt`;
    const cache = this.getCache()[promptName];

    if (check && cache) return cache;

    const result = await inquirer.prompt(...argus);

    this.writeCache({
      [promptName]: {
        ...(this.getCache()[promptName] || {}),
        ...result,
      },
    });

    return result;
  };

  /**
   * @example
   * store.writeFiles({ 'path': 'test' })
   *
   * @param {Object} files - files object
   */
  writeFiles = (files: { [string]: string }) => {
    const { projectDir, check } = this.ctx;
    const filesName = `${this.constructor.name}-files`;

    if (check) {
      checkFiles();
      return;
    }

    Object.keys(files).forEach((key: string) => {
      const writeFile = [path.resolve(projectDir, key), files[key]];

      outputFileSync(...writeFile);
      debugLog(writeFile);
    });

    this.writeCache({
      [filesName]: [
        ...(this.getCache()[filesName] || []),
        ...Object.keys(files),
      ],
    });
  };

  /**
   * @example
   * store.execa('command')
   *
   * @param {Array} commands - commands array
   */
  execa = async (...commands: $ReadOnlyArray<string>) => {
    const { projectDir, check } = this.ctx;
    const execaName = `${this.constructor.name}-commands`;

    if (check) {
      this.writeCache({
        [execaName]: await checkCommands(
          this.getCache()[execaName],
          commands,
          projectDir,
        ),
      });
      return;
    }

    for (const command of commands) {
      try {
        logger.info(chalk`Run command: {green ${command}}`);
        await execa.shell(command, {
          cwd: projectDir,
          stdio: 'inherit',
        });
      } catch (e) {
        debugLog(e);
        throw logger.fail(chalk`Run command: {red ${command}} fail`);
      }
    }

    this.writeCache({
      [execaName]: [...(this.getCache()[execaName] || []), ...commands],
    });
  };
}
