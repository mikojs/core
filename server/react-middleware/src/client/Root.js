// @flow
/* eslint-disable require-jsdoc, flowtype/require-return-type */
// TODO component should be ignored

import React, { type ElementType } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { type errorPropsType } from '../types';

import Main from 'templates/Main';
import ErrorComponent from 'templates/Error';

type routePropsType = {|
  exact: true,
  key: string,
  path: $ReadOnlyArray<string>,
  component: ElementType,
|};

type propsType = {|
  routesData: $ReadOnlyArray<routePropsType>,
|};

type stateType = {|
  error: ?$PropertyType<errorPropsType, 'error'>,
  errorInfo: ?$PropertyType<errorPropsType, 'errorInfo'>,
|};

export default class Root extends React.PureComponent<propsType, stateType> {
  state = {
    error: null,
    errorInfo: null,
  };

  componentDidCatch(
    error: $PropertyType<stateType, 'error'>,
    errorInfo: $PropertyType<stateType, 'errorInfo'>,
  ) {
    this.setState({ error, errorInfo });
  }

  render() {
    const { routesData } = this.props;
    const { error, errorInfo } = this.state;

    // TODO: testing in production
    if (error && errorInfo)
      return <ErrorComponent error={error} errorInfo={errorInfo} />;

    return (
      <Router>
        <Main>
          <Switch>
            {routesData.map((props: routePropsType) => (
              <Route {...props} />
            ))}
          </Switch>
        </Main>
      </Router>
    );
  }
}
