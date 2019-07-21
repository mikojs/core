// @flow

import React, { type ComponentType, type Node as NodeType } from 'react';
import {
  Route,
  type ContextRouter as contextRouterType,
} from 'react-router-dom';

import { type errorPropsType } from '../types';
import { Suspense } from '../ReactIsomorphic';

import type PagesHelperType from './PagesHelper';

export type propsType = {|
  Main: ComponentType<*>,
  Loading: ComponentType<{||}>,
  Error: ComponentType<errorPropsType>,
  pagesHelper: PagesHelperType,
  mainInitialProps: {},
|};

type stateType = {|
  error: ?$PropertyType<errorPropsType, 'error'>,
  errorInfo: ?$PropertyType<errorPropsType, 'errorInfo'>,
|};

/** control the all page Components */
export default class Root extends React.PureComponent<propsType, stateType> {
  state = {
    error: null,
    errorInfo: null,
  };

  /** @react */
  componentDidCatch(
    error: $PropertyType<stateType, 'error'>,
    errorInfo: $PropertyType<stateType, 'errorInfo'>,
  ) {
    this.setState({ error, errorInfo });
  }

  /** @react */
  render(): NodeType {
    const { Main, Loading, Error, pagesHelper, mainInitialProps } = this.props;
    const { error, errorInfo } = this.state;

    if (error && errorInfo)
      return <Error error={error} errorInfo={errorInfo} />;

    return (
      <Main {...mainInitialProps}>
        {<-P: { key: string }>(props?: P) => (
          <Suspense fallback={<Loading />}>
            <Route
              children={({
                location: { pathname, search },
                staticContext,
              }: contextRouterType) =>
                React.createElement(
                  // $FlowFixMe can not overwrite context type
                  pagesHelper.getPage({
                    location: { pathname, search },
                    staticContext,
                  }),
                  props,
                )
              }
            />
          </Suspense>
        )}
      </Main>
    );
  }
}
