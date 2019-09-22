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

import { normalizedQuestions, createLogger } from '@mikojs/utils';
import { type questionType } from '@mikojs/utils/lib/normalizedQuestions';

type pkgType = {
  [string]: string,
  husky?: {|
    hooks: {
      [string]: string,
    },
  |},
  author?: string,
  engines?: {
    [string]: string,
  },
  scripts?: {
    [string]: string,
  },
  private?: boolean,
  publishConfig?: {
    access: 'public',
  },
};

type ctxType = {|
  projectDir: string,
  skipCommand: boolean,
  lerna: boolean,
  useServer?: boolean,
  useReact?: boolean,
  useGraphql?: boolean,
  useStyles?: false | 'less' | 'css',
  useNpm?: boolean,
  pkg?: pkgType,
|};

const debugLog = debug('create-project:store');
const logger = createLogger('@mikojs/create-project');

/** default store */
export default class Store {
  ctx: ctxType;

  +debug = debug(`create-project:store:${this.constructor.name}`);

  +subStores = [];

  +start = emptyFunction;

  +end = emptyFunction;

  /**
   * @example
   * store.run(ctx)
   *
   * @param {Store.ctx} ctx - store context
   *
   * @return {Promise<Array<Store>>} - sotre array
   */
  +run = async (ctx: ctxType): Promise<$ReadOnlyArray<Store>> => {
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
   * store.prompt({ name: 'question' })
   *
   * @param {Array} questions - question array
   *
   * @return {Array} - normalized question array
   */
  +prompt = <-T>(...questions: $ReadOnlyArray<questionType<T>>) =>
    inquirer.prompt(
      normalizedQuestions('@mikojs/create-project')(...questions),
    );

  /**
   * @example
   * store.conflictFile(filePath, content)
   *
   * @param {string} filePath - file path
   * @param {string} content - file content
   */
  +conflictFile = async (filePath: string, content: string) => {
    const { action } = await this.prompt({
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
    });

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
          }: {|
            value: string,
            added: ?boolean,
            removed: ?boolean,
          |}) => {
            if (added) log(chalk`{green +${value}}`);
            else if (removed) log(chalk`{red -${value}}`);
            else log(` ${value}`);
          },
        );

        const { overwrite } = await this.prompt({
          name: 'overwrite',
          type: 'confirm',
          message: 'overwrite or not',
        });

        if (overwrite) outputFileSync(filePath, content);
        break;

      default:
        break;
    }
  };

  /**
   * @example
   * store.writeFiles({ 'path': 'test' })
   *
   * @param {{ string: string }} files - files object
   */
  +writeFiles = async (files: { [string]: string }) => {
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
  +execa = async (...commands: $ReadOnlyArray<string>) => {
    const { projectDir, skipCommand } = this.ctx;

    if (skipCommand) return;

    for (const command of commands) {
      try {
        const message = command.match(/".*"/);
        const cmd = !message
          ? command.split(/ /)
          : command
              .replace(message[0], '$message')
              .split(/ /)
              .map((text: string) => (text === '$message' ? message[0] : text));

        logger.info(chalk`Run command: {green ${command}}`);
        await execa(cmd[0], cmd.slice(1), {
          cwd: projectDir,
          stdio: 'inherit',
        });
      } catch (e) {
        debugLog(e);
        throw new Error(`Run command: \`${command}\` fail`);
      }
    }
  };
}
