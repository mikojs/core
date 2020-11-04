// @flow

import testingServer, {
  type fetchResultType as testingServerFetchResultType,
} from '@mikojs/server/lib/testingServer';

import graphql, { type graphqlType } from './index';

export type fetchResultType = testingServerFetchResultType;

export default {
  ...testingServer,

  /**
   * @param {string} folderPathOrMiddleware - folder path or middleware
   */
  run: async (folderPathOrMiddleware: string | graphqlType) => {
    await testingServer.run(
      typeof folderPathOrMiddleware === 'string'
        ? graphql(folderPathOrMiddleware)
        : folderPathOrMiddleware,
    );
  },
};
