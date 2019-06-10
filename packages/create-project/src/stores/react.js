// @flow

import memoizeOne from 'memoize-one';

import styles from './styles';
import relay from './relay';
import jest from './jest';
import configs from './configs';
import gitignore from './gitignore';
import Store from './index';

/**
 * @example
 * template(false)
 *
 * @param {boolean} useGraphql - use graphql or not
 *
 * @return {string} - context
 */
const template = (useGraphql?: boolean) =>
  !useGraphql
    ? `// @flow

import React from 'react';

const Home = () => <div>@cat-org/create-project</div>;

export default Home;`
    : `// @flow

import React, { type Node as NodeType } from 'react';
import { graphql } from 'react-relay';

import contexts from './.templates/contexts';

const { QueryPropsContext } = contexts;

export default class Home extends React.PureComponent<*> {
  static query = graphql\`
    query pages_homeQuery {
      version
    }
  \`;

  render(): NodeType {
    return (
      <QueryPropsContext.Consumer>
        {(props: mixed) => <div>{JSON.stringify(props)}</div>}
      </QueryPropsContext.Consumer>
    );
  }
}`;

const contextsTemplate = `// @flow

import React from 'react';

export default {
  QueryPropsContext: React.createContext(),
};`;

const mainTemplate = `// @flow

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

          return (
            <QueryPropsContext.Provider value={props}>
              {children}
            </QueryPropsContext.Provider>
          );
        }}
      />
    );
  }
}`;

/** react store */
class React extends Store {
  +subStores = [styles, relay, jest, configs, gitignore];

  storeUseReact = false;

  /**
   * @example
   * react.checkReact()
   */
  +checkReact = memoizeOne(
    async (
      useServer: $PropertyType<$PropertyType<Store, 'ctx'>, 'useServer'>,
    ) => {
      if (useServer)
        this.storeUseReact = (await this.prompt({
          name: 'useReact',
          message: 'use react or not',
          type: 'confirm',
          default: false,
        })).useReact;
      else this.storeUseReact = false;

      this.debug(this.storeUseReact);
    },
  );

  /**
   * @example
   * react.start(ctx)
   *
   * @param {Object} ctx - store context
   */
  +start = async (ctx: $PropertyType<Store, 'ctx'>) => {
    const { useServer } = ctx;

    await this.checkReact(useServer);

    ctx.useReact = this.storeUseReact;
  };

  /**
   * @example
   * react.end(ctx)
   *
   * @param {Object} ctx - store context
   */
  +end = async ({ useGraphql, lerna }: $PropertyType<Store, 'ctx'>) => {
    if (!this.storeUseReact) return;

    await this.writeFiles({
      'src/pages/index.js': template(useGraphql),
    });

    if (useGraphql)
      await this.writeFiles({
        'src/pages/.templates/contexts.js': contextsTemplate,
        'src/pages/.templates/Main.js': mainTemplate,
      });

    if (lerna) return;

    await this.execa(
      'yarn add react react-dom @cat-org/koa-react',
      'yarn add --dev @babel/preset-react',
    );
  };
}

export default new React();
