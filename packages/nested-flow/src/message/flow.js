// @flow

import path from 'path';

import debug from 'debug';

const debugLog = debug('nested-flow:message:flow');

/**
 * @example
 * flow()
 *
 * @return {object} - flow message object
 */
export default (): ({|
  keys: $ReadOnlyArray<string>,
  handle: (message: string, folder: string) => void,
  message: () => void,
|}) => {
  const { log } = console;
  const output = [];

  return {
    keys: ['flow', '--show-all-errors'],
    handle: (message: string, folder: string) => {
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
    message: () => {
      /*
        .replace(
          /\n\n... [0-9]+ more errors \(only [0-9]+ out of [0-9]+ errors displayed\)\n/g,
          '',
        )
        .replace(
          /To see all errors, re-run Flow with --show-all-errors\n/g,
          '',
        )
        */
      log(
        `${['', ...output].join('Error')}\n\nFound ${output.length} errors\n`,
      );
    },
  };
};
