// @flow

import testingServer, {
  type fetchResultType as testingServerFetchResultType,
} from '@mikojs/server/lib/testingServer';

import buildGraphql, {
  type optionsType,
  type graphqlType,
} from './buildGraphql';
import graphql from './index';

export type fetchResultType = testingServerFetchResultType;

let graphqlCache: graphqlType;

export default {
  ...testingServer,

  /**
   * @param {string} folderPath - folder path
   */
  run: async (folderPath: string) => {
    graphqlCache = buildGraphql(folderPath);
    await testingServer.run(graphql(folderPath));
  },

  /**
   * @param {optionsType} options - graphql options
   *
   * @return {graphqlType} - graphql function result
   */
  graphql: (options: optionsType): $Call<graphqlType, optionsType> =>
    graphqlCache(options),
};
