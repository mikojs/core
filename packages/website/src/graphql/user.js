// @flow

export default {
  typeDefs: `
  extend type Query {
    user: User
  }

  type User {
    id: ID!
  }
`,
  Query: {
    user: () => ({
      id: 'user-id',
    }),
  },
};
