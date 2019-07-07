// @flow

export default `
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
`;
