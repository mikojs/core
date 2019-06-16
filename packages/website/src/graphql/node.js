// @flow

export default {
  typeDefs: `
  interface Node {
    id: ID!
  }

  interface edge {
    cursor: String!
  }

  interface Connection {
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }
`,
};
