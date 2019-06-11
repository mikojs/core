// @flow
/* eslint-disable require-jsdoc */
// TODO component should be ignored

import React, { type Node as NodeType } from 'react';
import { graphql } from 'react-relay';

export default class Home extends React.PureComponent<*> {
  static query = graphql`
    query pages_homeQuery {
      version
    }
  `;

  render(): NodeType {
    return (
       <div>{JSON.stringify(this.props)}</div>
    );
  }
}
