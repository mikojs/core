// @flow

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import { emptyFunction } from 'fbjs';
import outputFileSync from 'output-file-sync';
import inquirer from 'inquirer';
import { diffLines } from 'diff';
import execa from 'execa';
import debug from 'debug';

import logger from 'utils/logger';
import normalizedQuestions from 'utils/normalizedQuestions';

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
  pkg?: pkgType,
  useNpm?: boolean,
|};

const debugLog = debug('create-project:store');

/** default store */
export default class Store {
  ctx: ctxType;

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

    this.ctx = ctx;
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
   * store.conflictFile(filePath, content)
   *
   * @param {string} filePath - file path
   * @param {string} content - file content
   */
  conflictFile = async (filePath: string, content: string) => {
    const { action } = await inquirer.prompt(
      normalizedQuestions({
        name: 'action',
        type: 'expand',
        message: chalk`find the existing file, overwrite {green ${path.resolve(
          process.cwd(),
          filePath,
        )}} or not`,
        choices: [
          {
            key: 'y',
            name: 'overwrite',
            value: 'overwrite',
          },
          {
            key: 'n',
            name: 'do not overwrite',
            value: 'skip',
          },
          {
            key: 'd',
            name: 'show the differences between the old and the new',
            value: 'diff',
          },
        ],
      }),
    );

    switch (action) {
      case 'overwrite':
        outputFileSync(filePath, content);
        break;

      case 'diff':
        const { log } = console;

        diffLines(fs.readFileSync(filePath, 'utf-8'), content).forEach(
          ({
            value,
            added,
            removed,
          }: {
            value: $ReadOnlyArray<string>,
            added: ?boolean,
            removed: ?boolean,
          }) => {
            value.forEach((str: string) => {
              if (added) log(chalk`{green +${str}}`);
              else if (removed) log(chalk`{red -${str}}`);
              else log(` ${str}`);
            });
          },
        );
        await this.conflictFile(filePath, content);
        break;

      default:
        break;
    }
  };

  /**
   * @example
   * store.writeFiles({ 'path': 'test' })
   *
   * @param {Object} files - files object
   */
  writeFiles = async (files: { [string]: string }) => {
    const { projectDir } = this.ctx;

    for (const key of Object.keys(files)) {
      const filePath = path.resolve(projectDir, key);

      if (fs.existsSync(filePath))
        await this.conflictFile(filePath, files[key]);
      else outputFileSync(filePath, files[key]);

      debugLog({
        filePath,
        file: files[key],
      });
    }
  };

  /**
   * @example
   * store.execa('command')
   *
   * @param {Array} commands - commands array
   */
  execa = async (...commands: $ReadOnlyArray<string>) => {
    const { projectDir } = this.ctx;

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
  };
}
