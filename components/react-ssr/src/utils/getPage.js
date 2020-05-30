// @flow

import { type ComponentType, type Node as NodeType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { matchRoutes } from 'react-router-config';
import { invariant } from 'fbjs';

import getStatic from 'utils/getStatic';

export type pageInitialArguType<C = {}> = {|
  ctx: C,
  isServer: boolean,
  match: { url: string },
|};

export type pageComponentType<C = {}, P = {}, EP = {}> = ComponentType<{
  ...P,
  ...EP,
}> & {
  getInitialProps?: (argu: pageInitialArguType<C>) => P,
};

export type mainInitialArguType<C = {}, P = pageComponentType<C, *>> = {|
  ctx: C,
  isServer: boolean,
  Page: P,
  pageProps: $Call<
    $NonMaybeType<$PropertyType<P, 'getInitialProps'>>,
    pageInitialArguType<C>,
  >,
|};

export type mainComponentType<C = {}, P = {}> = ComponentType<{
  ...P,
  children: () => NodeType,
}> & {
  getInitialProps?: (argu: mainInitialArguType<C>) => P,
};

export type routeType = {|
  exact: true,
  path: string,
  component: {|
    chunkName: string,
    loader: () => Promise<{|
      default: pageComponentType<*, *>,
    |}>,
  |},
|};

export type returnType = {|
  Page: pageComponentType<*, *>,
  mainProps: {},
  pageProps: {},
  chunkName: string,
|};

/**
 * @param {ComponentType} Main - Main Component
 * @param {routeType} routes - routes array
 * @param {object} ctx - ctx object
 * @param {boolean} isServer - is server or not
 *
 * @return {object} - page object
 */
export default async <-C>(
  Main: ComponentType<*>,
  routes: $ReadOnlyArray<routeType>,
  ctx: C & { pathname: string },
  isServer: boolean,
): Promise<returnType> => {
  const [matchRoute] = matchRoutes(routes, ctx.pathname);

  invariant(matchRoute, 'Can not find the match route');

  const {
    route: {
      component: { loader, chunkName },
    },
    match,
  } = matchRoute;
  const { default: Page } = await loader();
  const { head: pageHead, ...pageProps } =
    // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
    (await getStatic(Page).getInitialProps?.({
      ctx,
      isServer,
      match,
    })) || {};
  const { head: mainHead, ...mainProps } =
    // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
    (await getStatic(Main).getInitialProps?.({
      ctx,
      isServer,
      Page: getStatic(Page),
      pageProps,
    })) || {};

  renderToStaticMarkup(mainHead || null);
  renderToStaticMarkup(pageHead || null);

  return {
    Page,
    mainProps,
    pageProps,
    chunkName,
  };
};
