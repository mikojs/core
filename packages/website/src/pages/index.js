// @flow
/* eslint-disable require-jsdoc */
// TODO component should be ignored

import React, { type Node as NodeType } from 'react';
import { graphql } from 'react-relay';

import contexts from './.templates/contexts';

const { QueryPropsContext } = contexts;

export default class Home extends React.PureComponent<*> {
  static query = graphql`
    query pages_homeQuery {
      version
    }
  `;

  render(): NodeType {
    return (
      <QueryPropsContext.Consumer>
        {(props: mixed) => <div>{JSON.stringify(props)}</div>}
      </QueryPropsContext.Consumer>
    );
  }
}
