// @flow

export default {
  typeDefs: `
  type Query {
    version: String!
  }
`,
  Query: {
    version: () => '2.0.0',
  },
};
