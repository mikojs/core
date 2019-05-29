// @flow
/* eslint-disable require-jsdoc */
// TODO component should be ignored

import React, { type Node as NodeType } from 'react';
import {
  QueryRenderer,
  fetchQuery,
  type ReadyState as ReadyStateType,
} from 'react-relay';

import { type mainCtxType } from '@cat-org/koa-react/lib/types';

import contexts from './contexts';

import { initEnvironment, createEnvironment } from 'utils/createEnvironment';

type propsType = {|
  queryID: string,
  variables: mixed,
  relayData: mixed,
|};

const { QueryPropsContext } = contexts;

export default class Main extends React.PureComponent<
  propsType & {| children: NodeType |},
> {
  static getInitialProps = async ({
    Component: { query },
    pageProps: { variables },
  }: mainCtxType<>): propsType => {
    try {
      if (initEnvironment) {
        const { environment, relaySSR } = initEnvironment();

        await fetchQuery(environment, query, variables);

        return {
          queryID: query ? query().name : undefined,
          variables,
          relayData: await relaySSR.getCache(),
        };
      }
    } catch (e) {
      const { log } = console;

      log(e);
    }

    return {
      queryID: query ? query().name : undefined,
      variables,
    };
  };

  render(): NodeType {
    const { queryID, variables, relayData, children } = this.props;
    const environment = createEnvironment(
      relayData,
      JSON.stringify({
        queryID,
        variables,
      }),
    );

    return (
      <QueryRenderer
        environment={environment}
        query={queryID}
        variables={variables}
        render={({ error, props }: ReadyStateType): NodeType => {
          if (error) return <div>{error.message}</div>;

          if (!props) return <div>Loading</div>;

          return (
            <QueryPropsContext.Provider {...props}>
              {children}
            </QueryPropsContext.Provider>
          );
        }}
      />
    );
  }
}
