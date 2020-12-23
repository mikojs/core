// @flow

import path from 'path';

import execa from 'execa';
import getPort from 'get-port';
import findProcess from 'find-process';

import createLogger from '@mikojs/logger';

import sendToServer from './utils/sendToServer';
import endServer from './utils/endServer';

type addEndType<R> = { ...R, end: () => Promise<void> };

const logger = createLogger('@mikojs/worker');
let cachePid: number;

/**
 * @param {string} filePath - file path
 * @param {number} timeout - timeout setting
 *
 * @return {object} - worker functions
 */
const buildWorker = async <+R>(
  filePath: string,
  timeout?: number,
): Promise<addEndType<R>> => {
  const [mainProcess] = await findProcess(
    'name',
    path.resolve(__dirname, './bin/index.js'),
  );
  const port = mainProcess?.cmd.split(/ /).slice(-1)[0] || (await getPort());

  if (mainProcess?.pid !== cachePid) {
    cachePid = mainProcess.pid;
    logger.debug(mainProcess);
    logger.debug(process.pid);
  }

  if (!mainProcess)
    execa(path.resolve(__dirname, './bin/index.js'), [port], {
      detached: true,
      stdio: 'ignore',
    }).unref();

  return [
    ...(await sendToServer<$ReadOnlyArray<string>>(
      port,
      {
        type: 'start',
        argv: [],
        filePath,
      },
      timeout,
    )),
    'end',
  ].reduce(
    (result: addEndType<R>, key: string) => ({
      ...result,

      /**
       * @param {Array} argv - argv array
       *
       * @return {object} - response from the server
       */
      [key]: (...argv: $ReadOnlyArray<mixed>) =>
        sendToServer(
          port,
          {
            type: key,
            filePath,
            argv,
          },
          timeout,
        ),
    }),
    // $FlowFixMe FIXME: https://github.com/facebook/flow/issues/5332
    ({}: addEndType<R>),
  );
};

buildWorker.end = endServer;

export default buildWorker;
