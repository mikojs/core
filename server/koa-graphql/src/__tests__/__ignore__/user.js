// @flow

export default {
  typeDefs: `
  extend type Query {
    users: [User!]!
  }

  type User {
    id: ID!
    event: Event!
  }
`,
  Query: {
    users: () => [
      {
        id: 'user',
      },
    ],
  },
  User: {
    id: ({ id }: { id: string }) => `${id}-id`,
    event: () => ({
      id: 'event-id',
      name: 'event-name',
    }),
  },
};
