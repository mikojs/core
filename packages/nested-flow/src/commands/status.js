// @flow

import { Writable } from 'stream';
import readline from 'readline';

import execa from 'execa';
import debug from 'debug';

const debugLog = debug('nested-flow:commands:status');
const spinner = ['\\', '|', '/', '-'];

/**
 * @example
 * status(['flow'], '/folder')
 *
 * @param {Array} argv - argv array
 * @param {string} cwd - the folder where command runs
 */
export default async (argv: $ReadOnlyArray<string>, cwd: string) => {
  const isShowAllErrors = argv.includes('--show-all-errors');
  const subprocess = execa(
    argv[0],
    [...argv.slice(1), ...(isShowAllErrors ? [] : ['--show-all-errors'])],
    { cwd },
  );
  let spinnerIndex: number = 0;
  let startingServer: boolean = false;

  const transform = new Writable({
    write: (chunk: Buffer | string, encoding: string, callback: () => void) => {
      const output = chunk.toString().replace(/\n$/, '');

      if (
        /Please wait/.test(output) ||
        /Started a new flow server/.test(output)
      ) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${output}: ${spinner[spinnerIndex]}`);
        spinnerIndex =
          spinner.length - 1 === spinnerIndex ? 0 : spinnerIndex + 1;
        startingServer = true;
      } else {
        if (startingServer) {
          readline.clearLine(process.stdout, 0);
          readline.cursorTo(process.stdout, 0);
          startingServer = false;
        }

        const { log } = console;

        log(output);
      }

      callback();
    },
  });

  debugLog({ isShowAllErrors });
  subprocess.stdout.pipe(transform);
  subprocess.stderr.pipe(transform);

  await subprocess;
};

/*
export default (): commandType => {
  const { log } = console;
  const output = [];
  let isShowAllErrors: boolean = true;

  return {
    fail: (message: string, folder: string) => {
      const newOutput = message
        .replace(
          /Error ([-]+) /g,
          `Error $1 ${path.relative(process.cwd(), folder)}`,
        )
        .replace(/\n\nFound [0-9]+ errors\n/g, '')
        .split(/Error/)
        .filter(Boolean);

      debugLog(newOutput);
      output.push(...newOutput);
    },
    end: (): number => {
      debugLog(isShowAllErrors);

      if (output.length === 0) {
        log('No errors!');
        return 0;
      }

      log(
        ['', ...(isShowAllErrors ? output : output.slice(0, 50))].join('Error'),
      );
      log(
        !isShowAllErrors && output.length > 50
          ? `
...${output.length - 50} more errors (only 50 out of ${
              output.length
            } errors displayed)
To see all errors, re-run Flow with --show-all-errors
`
          : `\nFound ${output.length} errors\n`,
      );
      return 1;
    },
  };
};
 */
