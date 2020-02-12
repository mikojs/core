// @flow

import React, { type Node as NodeType } from 'react';
import {
  QueryRenderer,
  fetchQuery,
  type ReadyState as ReadyStateType,
  type GraphQLTaggedNode as GraphQLTaggedNodeType,
  type Variables as VariablesType,
} from 'react-relay';
import { type SSRCache as SSRCacheType } from 'react-relay-network-modern-ssr/node8/server';

import {
  type mainInitialArguType,
  type pageComponentType,
} from '@mikojs/react-ssr';

import { initEnvironment, createEnvironment } from 'utils/createEnvironment';

type pageType = pageComponentType<
  {},
  {
    variables?: VariablesType,
  },
> & {
  query?: GraphQLTaggedNodeType,
};

type propsType = {|
  variables?: VariablesType,
  relayData?: SSRCacheType,
  Page: pageType,
  children: <P>(props: P) => NodeType,
|};

/** @react control the all page Components */
const Main = ({
  variables = {},
  relayData,
  Page,
  children,
}: propsType): NodeType => {
  const environment = createEnvironment(
    relayData,
    JSON.stringify({
      queryID: Page.query?.params.name,
      variables,
    }),
  );

  return (
    <QueryRenderer
      environment={environment}
      query={Page.query}
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
 * @param {mainInitialArguType} ctx - context from @mikojs/koa-react
 *
 * @return {propsType} - initial props
 */
Main.getInitialProps = async ({
  Page,
  pageProps: { variables },
}: mainInitialArguType<{}, pageType>): Promise<
  $Diff<propsType, { Page: mixed, children: mixed }>,
> => {
  try {
    if (initEnvironment && Page.query) {
      const { environment, relaySSR } = initEnvironment();

      await fetchQuery(environment, Page.query, variables);

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
