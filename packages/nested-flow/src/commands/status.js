// @flow

import path from 'path';

import debug from 'debug';

import { type commandType } from '../types';

const debugLog = debug('nested-flow:message:status');

/**
 * @example
 * statu()
 *
 * @return {commandType} - status command object
 */
export default (): commandType => {
  const { log } = console;
  const output = [];
  let isShowAllErrors: boolean = true;

  return {
    overwriteArgv: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => {
      if (argv.includes('--show-all-errors')) return argv;

      isShowAllErrors = false;

      return [...argv, '--show-all-errors'];
    },
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
