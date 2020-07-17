// @flow

import { emptyFunction } from 'fbjs';

import buildReadFiles, {
  type callbackType,
  type optionsType as buildReadFilesOptionsType,
} from './utils/buildReadFiles';
import buildTesting, {
  type returnType as buildTestingReturnType,
} from './utils/buildTesting';

type middlewareType = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => Promise<void> | void;

type optionsType = {|
  dev: callbackType,
  prod: callbackType,
  middleware: middlewareType,
|};

type runningType = 'dev' | 'prod' | 'start';

type returnType = middlewareType & {
  ready: (type: runningType) => Promise<void>,
  testing: buildTestingReturnType,
};

let running: runningType;

/**
 * @param {optionsType} options - build options
 *
 * @return {returnType} - middleware
 */
export default ({
  dev,
  prod,
  middleware: originialMiddleware,
}: optionsType) => (config: buildReadFilesOptionsType): returnType => {
  /**
   * @param {object} req - http request
   * @param {object} res - http response
   */
  const middleware = async (
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ) => {
    await originialMiddleware(req, res);
  };
  const isProduction = process.env.NODE_ENV === 'production';
  const readFiles = buildReadFiles(config, isProduction ? prod : dev);

  /**
   * @param {runningType} type - running type
   */
  middleware.ready = async (type: runningType) => {
    running = running || type;

    if (running === 'start') return;

    await readFiles();
  };
  middleware.testing = isProduction
    ? emptyFunction
    : buildTesting({ dev, prod });

  return middleware;
};
