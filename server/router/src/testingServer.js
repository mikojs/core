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
   */
  run: async (folderPathOrMiddleware: string | routerType) => {
    await testingServer.run(
      typeof folderPathOrMiddleware === 'string'
        ? router(folderPathOrMiddleware)
        : folderPathOrMiddleware,
    );
  },
};
