// @flow

import {
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';

import findCacheDir from 'find-cache-dir';
import cryptoRandomString from 'crypto-random-string';
import outputFileSync from 'output-file-sync';

import { requireModule } from '@mikojs/utils';

export type middlewareType = (
  req: IncomingMessageType,
  res: ServerResponseType,
) => Promise<void> | void;

export type contextType = {|
  load: () => middlewareType,
  build: () => void,
|};

const cacheDir = findCacheDir({ name: '@mikojs/server', thunk: true });

/**
 * @return {contextType} - server context
 */
const buildContext = (): contextType => {
  const context: {|
    [string]: string,
  |} = {};

  return {
    /**
     * @return {middlewareType} - middleware
     */
    load: (): middlewareType => {
      const hash = cryptoRandomString({ length: 10, type: 'alphanumeric' });
      const cacheFilePath = cacheDir(`${hash}.js`);

      context[hash] = cacheFilePath;

      return (req: IncomingMessageType, res: ServerResponseType) => {
        requireModule<middlewareType>(cacheFilePath)(req, res);
      };
    },

    /** */
    build: () => {
      Object.keys(context).forEach((key: string) => {
        outputFileSync(
          context[key],
          `module.exports = (req, res) => {
  res.end(req.url);
};`,
        );
      });
    },
  };
};

export default buildContext();
