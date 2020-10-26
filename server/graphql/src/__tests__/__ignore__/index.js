// @flow

export default {
  typeDefs: `
    type Query {
      version: String!
    }
  `,
  Query: {
    /**
     * @return {string} - version
     */
    version: () => '1.0.0',
  },
};
