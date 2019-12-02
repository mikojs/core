// @flow

import path from 'path';
import { Writable } from 'stream';
import readline from 'readline';

import chalk from 'chalk';
import execa from 'execa';
import debug from 'debug';

const MAX_ERROR = 50;
const debugLog = debug('nested-flow:commands:status');
const spinner = ['\\', '|', '/', '-'];
let countError: number = 0;

/**
 * @example
 * printMessage('message', '/folder', false)
 *
 * @param {string} message - message to print
 * @param {string} cwd - the folder where command runs
 * @param {boolean} isShowAllErrors - if show the all errors
 */
const printMessage = (
  message: string,
  cwd: string,
  isShowAllErrors: boolean,
) => {
  if (countError < MAX_ERROR || isShowAllErrors)
    process.stdout.write(
      message
        .replace(
          /Error ([-]+) /g,
          `Error $1 ${path.relative(process.cwd(), cwd)}/`,
        )
        .replace(/\nFound [0-9]+ errors\n/g, ''),
    );

  if (/Error ([-]+)/.test(message)) countError += 1;
};

/**
 * @example
 * status(['flow'], '/folder')
 *
 * @param {Array} argv - argv array
 * @param {string} cwd - the folder where command runs
 *
 * @return {Function} - the end function
 */
export default async (
  argv: $ReadOnlyArray<string>,
  cwd: string,
): Promise<() => void> => {
  const isShowAllErrors = argv.includes('--show-all-errors');
  const subprocess = execa(
    argv[0],
    [
      ...argv.slice(1),
      ...(isShowAllErrors ? [] : ['--show-all-errors']),
      '--color',
      'always',
    ],
    { cwd },
  );
  let spinnerIndex: number = 0;
  let startingServer: boolean = false;
  let prevOutput: string = '';

  const transform = new Writable({
    write: (chunk: Buffer | string, encoding: string, callback: () => void) => {
      const output = chunk.toString();

      if (
        /Please wait/.test(output) ||
        /Started a new flow server/.test(output)
      ) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(
          `${output.replace(/\n$/, '')}: ${spinner[spinnerIndex]}`,
        );
        spinnerIndex =
          spinner.length - 1 === spinnerIndex ? 0 : spinnerIndex + 1;
        startingServer = true;
      } else if (
        /^Launching Flow server for/.test(output) ||
        /^Spawned flow server/.test(output) ||
        /^Logs will go to/.test(output) ||
        /^Monitor logs will go to/.test(output)
      ) {
        process.stdout.write(output);
      } else {
        if (startingServer) {
          readline.clearLine(process.stdout, 0);
          readline.cursorTo(process.stdout, 0);
          startingServer = false;
        }

        if (!/No errors!/.test(output))
          prevOutput = output
            .split(/\n/)
            .reduce(
              (
                result: string,
                message: string,
                index: number,
                allMessages: $ReadOnlyArray<string>,
              ): string => {
                const addEnterLine =
                  index !== allMessages.length - 1 ? '\n' : '';

                debugLog(message);

                if (/Error ([-]+)/.test(message)) {
                  printMessage(result, cwd, isShowAllErrors);

                  return `${message}${addEnterLine}`;
                }

                return `${result}${message}${addEnterLine}`;
              },
              prevOutput,
            );
      }

      callback();
    },
  });

  debugLog({ isShowAllErrors });
  subprocess.stdout.pipe(transform);
  subprocess.stderr.pipe(transform);

  await subprocess;
  printMessage(prevOutput, cwd, isShowAllErrors);

  return () => {
    const { log } = console;

    if (countError === 0) {
      log(chalk`{reset No errors!}`);
      return;
    }

    log(
      !isShowAllErrors && countError > MAX_ERROR
        ? chalk`{reset \n...${(
            countError - MAX_ERROR
          ).toString()} more errors (only ${MAX_ERROR.toString()} out of ${countError.toString()} errors displayed)
To see all errors, re-run Flow with --show-all-errors}`
        : chalk`{reset \nFound ${countError.toString()} errors}`,
    );
    return;
  };
};
