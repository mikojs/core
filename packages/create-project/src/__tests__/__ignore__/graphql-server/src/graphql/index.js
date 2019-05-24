// @flow

import { version } from '../../package.json';

export default {
  typeDefs: `
  type Query {
    version: String!
  }
`,
  Query: {
    version: () => version,
  },
};
