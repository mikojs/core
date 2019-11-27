// @flow

import path from 'path';

/**
 * @example
 * flow()
 *
 * @return {object} - flow message object
 */
export default (): ({|
  keys: $ReadOnlyArray<string>,
  message: (message: string, folder: string) => void,
  end: () => void,
|}) => {
  const { log } = console;
  let countError: number = 0;

  return {
    keys: ['flow'],
    message: (message: string, folder: string) => {
      log(
        message
          .replace(
            /Error ([-]+) /g,
            `Error $1 ${path.relative(process.cwd(), folder)}`,
          )
          .replace(/\n\nFound [0-9]+ errors\n/g, '')
          .replace(
            /\n\n... [0-9]+ more errors \(only [0-9]+ out of [0-9]+ errors displayed\)\n/g,
            '',
          )
          .replace(
            /To see all errors, re-run Flow with --show-all-errors\n/g,
            '',
          ),
      );

      countError += (message.match(/Error ([-]+) /g) || []).length;
    },
    end: () => {
      log(`\nFound ${countError} errors\n`);
    },
  };
};
