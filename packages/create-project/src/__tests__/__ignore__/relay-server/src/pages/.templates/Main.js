// @flow

import React, { type Node as NodeType, type ComponentType } from 'react';
import {
  QueryRenderer,
  // $FlowFixMe TODO
  fetchQuery,
  type ReadyState as ReadyStateType,
  type GraphQLTaggedNode as GraphQLTaggedNodeType,
  type Variables as VariablesType,
} from 'react-relay';
import { type SSRCache as SSRCacheType } from 'react-relay-network-modern-ssr/node8/server';

import { type mainCtxType } from '@cat-org/koa-react/lib/types';

import {
  initEnvironment,
  createEnvironment,
} from '../../utils/createEnvironment';

type pageComponentType = ComponentType<*> & {|
  query?: GraphQLTaggedNodeType,
|};

type propsType = {|
  variables: VariablesType,
  relayData?: SSRCacheType,
  Component: pageComponentType,
  children: <P>(props: P) => NodeType,
|};

export default class Main extends React.PureComponent<
  propsType & {| children: NodeType |},
> {
  static getInitialProps = async ({
    Component: { query },
    pageProps: { variables },
  }: mainCtxType<
    {
      variables?: VariablesType,
    },
    {},
    pageComponentType,
  >): Promise<$Diff<propsType, { Component: mixed, children: mixed }>> => {
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
    const { variables, relayData, Component, children } = this.props;
    const environment = createEnvironment(
      relayData,
      JSON.stringify({
        // $FlowFixMe TODO
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
