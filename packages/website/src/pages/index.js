// @flow

import React from 'react';
import { graphql } from 'react-relay';

type propsType = {|
  version: string,
|};

/** @react render the home page */
const Home = (props: propsType) => <div>{JSON.stringify(props)}</div>;

Home.query = graphql`
  query pages_homeQuery {
    version
  }
`;

export default React.memo<propsType>(Home);
