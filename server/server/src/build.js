// @flow

import { emptyFunction } from 'fbjs';

import buildDev, {
  type returnType as buildDevReturnType,
} from './utils/buildDev';
import buildProd, {
  type returnType as buildProdReturnType,
} from './utils/buildProd';
import buildTesting, {
  type optionsType as buildTestingOptionsType,
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
  ...buildTestingOptionsType,
  dev: callbackType,
  prod: callbackType,
  middleware: middlewareType,
|};

type returnType = middlewareType & {
  ready: buildDevReturnType | buildProdReturnType,
  testing: buildTestingReturnType,
};

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

  middleware.ready = isProduction
    ? buildProd(prod, config)
    : buildDev(dev, config);
  middleware.testing = isProduction
    ? emptyFunction
    : buildTesting({ dev, prod });

  return middleware;
};
