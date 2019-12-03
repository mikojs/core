// @flow

import path from 'path';
import { Writable } from 'stream';

import execa from 'execa';
import envinfo from 'envinfo';

/**
 * @example
 * addFlowVersion()
 *
 * @return {Array} - if the version can be found, use to add the version arguments
 */
const addFlowVersion = async (): Promise<$ReadOnlyArray<string>> => {
  // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
  const version = JSON.parse(
    await envinfo.run(
      {
        npmPackages: ['flow-bin'],
      },
      { json: true },
    ),
  ).npmPackages?.['flow-bin']?.wanted.replace(/\^/, '');

  return !version ? [] : ['-f', version];
};

/**
 * @example
 * command(['flow-typed', 'install'], '/folder')
 *
 * @param {Array} argv - argv array
 * @param {string} cwd - the folder where command runs
 */
export default async (argv: $ReadOnlyArray<string>, cwd: string) => {
  const subprocess = execa(
    argv[0],
    [
      ...argv.slice(1),
      ...(argv.includes('-f') || argv.includes('--flowVersion')
        ? []
        : await addFlowVersion()),
    ],
    {
      cwd,
    },
  );
  const transform = new Writable({
    write: (chunk: Buffer | string, encoding: string, callback: () => void) => {
      process.stdout.write(
        chunk
          .toString()
          .replace(
            /(flow-typed\/npm)/g,
            path.relative(process.cwd(), path.resolve(cwd, './flow-typed/npm')),
          ),
      );
      callback();
    },
  });

  subprocess.stdout.pipe(transform);
  subprocess.stderr.pipe(transform);

  await subprocess;
};
