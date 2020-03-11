// @flow

import path from 'path';

import execa from 'execa';
import getPort from 'get-port';
import debug from 'debug';
import findProcess from 'find-process';

import sendToServer from './utils/sendToServer';

const debugLog = debug('worker');
let cachePid: number;

/**
 * @example
 * worker('/filePath')
 *
 * @param {string} filePath - file path
 * @param {number} timeout - timeout setting
 *
 * @return {object} - worker functions
 */
export default async <+R>(filePath: string, timeout?: number): Promise<R> => {
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

  return [
    ...(await sendToServer<$ReadOnlyArray<string>>(
      port,
      JSON.stringify({
        type: 'start',
        filePath,
      }),
      timeout,
    )),
    'end',
  ].reduce(
    (result: R, key: string) => ({
      ...result,
      [key]: (...argv: $ReadOnlyArray<mixed>) =>
        sendToServer(
          port,
          JSON.stringify({
            type: key,
            filePath,
            argv,
          }),
          timeout,
        ),
    }),
    // $FlowFixMe FIXME: https://github.com/facebook/flow/issues/5332
    ({}: R),
  );
};
