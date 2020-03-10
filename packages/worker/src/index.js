// @flow

import path from 'path';

import execa from 'execa';
import getPort from 'get-port';
import debug from 'debug';
import findProcess from 'find-process';

import sendToServer from './utils/sendToServer';

type returnType = (
  type: string,
  ...argv: $ReadOnlyArray<mixed>
) => Promise<void>;

const debugLog = debug('worker');
let cachePid: number;

/**
 * @example
 * worker('/filePath')
 *
 * @param {string} filePath - file path
 *
 * @return {returnType} - worker function
 */
export default async (filePath: string): Promise<returnType> => {
  const allProcesses = await findProcess(
    'name',
    path.resolve(__dirname, './bin/index.js'),
  );
  const [mainProcess] = allProcesses;
  const port = mainProcess?.cmd.split(/ /).slice(-1)[0] || (await getPort());

  if (mainProcess?.pid !== cachePid) {
    cachePid = mainProcess.pid;
    debugLog(mainProcess);
    debugLog(process.pid);
  }

  if (!mainProcess)
    execa(path.resolve(__dirname, './bin/index.js'), [port], {
      detached: true,
      stdio: 'ignore',
    }).unref();

  await sendToServer(
    port,
    JSON.stringify({
      type: 'init',
      filePath,
    }),
  );

  return (type: string, ...argv: $ReadOnlyArray<mixed>) =>
    sendToServer(
      port,
      JSON.stringify({
        type,
        filePath,
        argv,
      }),
    );
};
