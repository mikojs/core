// @flow

export default {
  typeDefs: `
  type Query {
    version: String!
  }
`,
  Query: {
    version: () => '1.0.0',
  },
};
