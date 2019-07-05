// @flow

import React, { type Node as NodeType } from 'react';
import { graphql } from 'react-relay';

/** render the home page */
export default class Home extends React.PureComponent<{| version: string |}> {
  static query = graphql`
    query pages_homeQuery {
      version
    }
  `;

  /** @react */
  render(): NodeType {
    return <div>{JSON.stringify(this.props)}</div>;
  }
}
