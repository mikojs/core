// @flow

import { type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { matchRoutes } from 'react-router-config';
import { invariant } from 'fbjs';

import getStatic from 'utils/getStatic';

export type pageComponentType = ComponentType<*> & {
  getInitialProps?: ({
    ctx: { [string]: string },
    isServer: boolean,
    match: { url: string },
  }) => {},
};

export type mainComponentType = ComponentType<*> & {
  getInitialProps?: ({
    ctx: { [string]: string },
    isServer: boolean,
    Page: pageComponentType,
    pageProps: {},
  }) => {},
};

export type routesDataType = $ReadOnlyArray<{|
  exact: true,
  path: $ReadOnlyArray<string>,
  component: {|
    chunkName: string,
    loader: () => Promise<{|
      default: pageComponentType,
    |}>,
  |},
|}>;

export type returnType = {|
  Page: pageComponentType,
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
export default async <C>(
  Main: ComponentType<*>,
  routesData: routesDataType,
  ctx: C & { path: string },
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
