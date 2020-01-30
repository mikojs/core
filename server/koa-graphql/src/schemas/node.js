// @flow

export default {
  typeDefs: `
    # An object with an ID.
    interface Node {
      # ID of the object.
      id: ID!
    }

    # An edge in a connection.
    interface Edge {
      # A cursor for use in pagination.
      cursor: String!

      # The item at the end of the edge.
      node: Node!
    }

    # Look up data listings.
    interface Connection {
      # A list of edges.
      edges: [Edge]!

      # Information to aid in pagination.
      pageInfo: PageInfo!

      # Identifies the total count of items in the connection.
      total: Int!
    }

    # Information about pagination in a connection.
    type PageInfo {
      # When paginating forwards, the cursor to continue.
      endCursor: String

      # When paginating forwards, are there more items?
      hasNextPage: Boolean!

      # When paginating backwards, are there more items?
      hasPreviousPage: Boolean!

      # When paginating backwards, the cursor to continue.
      startCursor: String
    }
  `,
};
