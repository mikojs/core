// @flow

import testingServer, {
  type fetchResultType as testingServerFetchResultType,
} from '@mikojs/server/lib/testingServer';

import router, { type routerType } from './index';

export type fetchResultType = testingServerFetchResultType;

export default {
  ...testingServer,

  /**
   * @param {string} folderPathOrMiddleware - folder path or middleware
   * @param {string} prefix - pathname prefix
   */
  run: async (folderPathOrMiddleware: string | routerType, prefix?: string) => {
    await testingServer.run(
      typeof folderPathOrMiddleware === 'string'
        ? router(folderPathOrMiddleware, prefix)
        : folderPathOrMiddleware,
    );
  },
};
