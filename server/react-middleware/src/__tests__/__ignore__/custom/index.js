// @flow

import React from 'react';

import Context from '../Context';

export default () => (
  <Context.Consumer>{(data: string) => <div>{data}</div>}</Context.Consumer>
);
