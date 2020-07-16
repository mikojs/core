// @flow

import { emptyFunction } from 'fbjs';

import buildDev from './utils/buildDev';
import buildProd from './utils/buildProd';
import buildTesting, {
  type returnType as buildTestingReturnType,
} from './utils/buildTesting';
import {
  type callbackType,
  type optionsType as readFilesOptionsType,
} from './utils/readFiles';

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
}: optionsType) => (config: readFilesOptionsType): returnType => {
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
  const run = isProduction ? buildProd(prod, config) : buildDev(dev, config);

  /**
   * @param {runningType} type - running type
   */
  middleware.ready = async (type: runningType) => {
    running = running || type;

    if (running === 'start') return;

    await run();
  };
  middleware.testing = isProduction
    ? emptyFunction
    : buildTesting({ dev, prod });

  return middleware;
};
