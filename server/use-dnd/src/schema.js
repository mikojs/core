// @flow

import GraphQLJSON from 'graphql-type-json';

export default {
  typeDefs: `
  scalar JSON

  type Component implements Node {
    id: ID!
    type: String!
    fields: JSON
  }

  type ComponentEdge implements Edge {
    cursor: String!
    node: Component!
  }

  type ComponentConnection implements Connection {
    edges: [ComponentEdge]!
    pageInfo: PageInfo!
    total: Int!
  }

  extend type Query {
    components: ComponentConnection!
  }
  `,
  Query: {
    components: () => ({
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
      edges: [
        {
          cursor: 'test',
          node: {
            id: '9ec38465-8fd1-4305-98c1-9ebafe888f95',
            type: 'block',
            fields: {
              key: 'value',
            },
          },
        },
      ],
      total: 1,
    }),
  },
  JSON: GraphQLJSON,
};
