// @flow

import { version } from '../../package.json';

export default {
  typeDefs: `
  # The query root of GraphQL interface.
  type Query {
    # The version of GraphQL API.
    version: String!
  }
`,
  Query: {
    version: () => version,
  },
};
