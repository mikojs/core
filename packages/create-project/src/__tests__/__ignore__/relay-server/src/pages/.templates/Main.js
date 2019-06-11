// @flow

import React, { type Node as NodeType } from 'react';
import {
  QueryRenderer,
  fetchQuery,
  type ReadyState as ReadyStateType,
} from 'react-relay';

import { type mainCtxType } from '@cat-org/koa-react/lib/types';

import { initEnvironment, createEnvironment } from 'utils/createEnvironment';

type propsType = {|
  queryID: string,
  variables: mixed,
  relayData: mixed,
|};

export default class Main extends React.PureComponent<
  propsType & {| children: NodeType |},
> {
  static getInitialProps = async ({
    Component: { query },
    pageProps: { variables = {} },
  }: mainCtxType<>): propsType => {
    try {
      if (initEnvironment) {
        const { environment, relaySSR } = initEnvironment();

        await fetchQuery(environment, query, variables);

        return {
          variables,
          relayData: await relaySSR.getCache(),
        };
      }
    } catch (e) {
      const { log } = console;

      log(e);
    }

    return {
      variables,
    };
  };

  render(): NodeType {
    const { Component, variables, relayData, children } = this.props;
    const environment = createEnvironment(
      relayData,
      JSON.stringify({
        queryID: Component.query ? Component.query().params.name : undefined,
        variables,
      }),
    );

    return (
      <QueryRenderer
        environment={environment}
        query={Component.query}
        variables={variables}
        render={({ error, props }: ReadyStateType): NodeType => {
          if (error) return <div>{error.message}</div>;

          if (!props) return <div>Loading</div>;

          return children(props);
        }}
      />
    );
  }
}
