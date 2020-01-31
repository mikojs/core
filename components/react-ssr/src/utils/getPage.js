// @flow

import { type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { matchRoutes } from 'react-router-config';
import { invariant } from 'fbjs';

import getStatic from 'utils/getStatic';

export type routesDataType = $ReadOnlyArray<{|
  exact: true,
  path: $ReadOnlyArray<string>,
  component: {|
    chunkName: string,
    loader: () => Promise<{|
      default: ComponentType<*>,
    |}>,
  |},
|}>;

export type returnType = {|
  Page: ComponentType<*>,
  mainProps: {},
  pageProps: {},
  chunkName: string,
|};

/**
 * @example
 * getPage(Main, routesData, { path }, true)
 *
 * @param {ComponentType} Main - Main Component
 * @param {routesDataType} routesData - routes data
 * @param {object} ctx - ctx object
 * @param {boolean} isServer - is server or not
 *
 * @return {object} - page object
 */
export default async (
  Main: ComponentType<*>,
  routesData: routesDataType,
  ctx: {
    [string]: string,
  },
  isServer: boolean,
): Promise<returnType> => {
  const [matchRoute] = matchRoutes(routesData, ctx.path);

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
      Component: getStatic(Page),
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
