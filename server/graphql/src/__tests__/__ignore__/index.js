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
    version: (): string => '1.0.0',
  },
};
