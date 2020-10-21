// @flow

import testingServer, {
  type fetchResultType as testingServerFetchResultType,
} from '@mikojs/server/lib/testingServer';

import router from './index';

export type fetchResultType = testingServerFetchResultType;

export default {
  ...testingServer,

  /**
   * @param {string} folderPath - folder path
   */
  run: async (folderPath: string) => {
    await testingServer.run(router(folderPath));
  },
};
