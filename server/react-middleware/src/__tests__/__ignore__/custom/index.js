// @flow
/* eslint-disable require-jsdoc, flowtype/require-return-type */
// TODO component should be ignored

import React from 'react';

import Context from '../Context';

const Home = () => (
  <Context.Consumer>{(data: string) => <div>{data}</div>}</Context.Consumer>
);

export default Home;
