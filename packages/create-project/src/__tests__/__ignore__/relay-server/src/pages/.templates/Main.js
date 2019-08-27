// @flow

import React, { type Node as NodeType, type ComponentType } from 'react';
import { isMemo } from 'react-is';
import {
  QueryRenderer,
  fetchQuery,
  type ReadyState as ReadyStateType,
  type GraphQLTaggedNode as GraphQLTaggedNodeType,
  type Variables as VariablesType,
} from 'react-relay';
import { type SSRCache as SSRCacheType } from 'react-relay-network-modern-ssr/node8/server';

import { type mainCtxType } from '@cat-org/koa-react/lib/types';

import { initEnvironment, createEnvironment } from 'utils/createEnvironment';

type pageComponentType = ComponentType<*> & {|
  query?: GraphQLTaggedNodeType,
  type: {
    query?: GraphQLTaggedNodeType,
  },
|};

type propsType = {|
  variables?: VariablesType,
  relayData?: SSRCacheType,
  Component: pageComponentType,
  children: <P>(props: P) => NodeType,
|};

/** @react control the all page Components */
const Main = ({
  variables = {},
  relayData,
  Component,
  children,
}: propsType): NodeType => {
  const { query } = (!isMemo(Component) ? Component : Component.type) || {};
  const environment = createEnvironment(
    relayData,
    JSON.stringify({
      queryID: query?.()?.params.name,
      variables,
    }),
  );

  return (
    <QueryRenderer
      environment={environment}
      query={query}
      variables={variables}
      render={({ error, props }: ReadyStateType): NodeType => {
        if (error) return <div>{error.message}</div>;

        if (!props) return <div>Loading</div>;

        return children(props);
      }}
    />
  );
};

/**
 * @example
 * Main.getInitialProps(ctx)
 *
 * @param {mainCtxType} ctx - context from @cat-org/koa-react
 *
 * @return {propsType} - initial props
 */
Main.getInitialProps = async ({
  Component,
  pageProps: { variables },
}: mainCtxType<
  {
    variables?: VariablesType,
  },
  {},
  pageComponentType,
>): Promise<$Diff<propsType, { Component: mixed, children: mixed }>> => {
  try {
    const { query } = (!isMemo(Component) ? Component : Component.type) || {};

    if (initEnvironment && query) {
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

export default React.memo<propsType>(Main);
