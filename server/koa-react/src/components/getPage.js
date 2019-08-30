// @flow

import { isMemo } from 'react-is';
import { renderToStaticMarkup } from 'react-dom/server';
import { matchRoutes } from 'react-router-config';
import { type Context as contextType } from 'koa';

import { type propsType as rootPropsType } from './Root';

/**
 * @example
 * getPage(Main, routesData, ctx, true)
 *
 * @param {rootPropsType.Main} Main - Main Component
 * @param {rootPropsType.routesData} routesData - routes data
 * @param {{ [string]: string }} ctx - context from react-router
 * @param {boolean} isServer - check is Server
 *
 * @return {rootPropsType['InitialPage' | 'mainInitialProps' | 'pageInitialProps']} - the data for rendering page
 */
export default async (
  Main: $PropertyType<rootPropsType, 'Main'>,
  routesData: $PropertyType<rootPropsType, 'routesData'>,
  ctx:
    | contextType
    | {
        [string]: string,
      },
  isServer: boolean,
): Promise<{|
  Page: $PropertyType<rootPropsType, 'InitialPage'>,
  mainProps: $PropertyType<rootPropsType, 'mainInitialProps'>,
  pageProps: $PropertyType<rootPropsType, 'pageInitialProps'>,
|}> => {
  const [
    {
      route: {
        component: { loader },
      },
      match,
    },
  ] = matchRoutes(routesData, ctx.path);
  const { default: Page } = await loader();
  const { head: pageHead, ...pageProps } =
    // $FlowFixMe Flow does not yet support method or property calls in optional chains.
    (await (!isMemo(Page) ? Page : Page.type).getInitialProps?.({
      ctx,
      isServer,
      match,
    })) || {};
  const { head: mainHead, ...mainProps } =
    // $FlowFixMe Flow does not yet support method or property calls in optional chains.
    (await (!isMemo(Main) ? Main : Main.type).getInitialProps?.({
      ctx,
      isServer,
      Component: Page,
      pageProps,
    })) || {};

  renderToStaticMarkup(mainHead || null);
  renderToStaticMarkup(pageHead || null);

  return {
    Page,
    mainProps,
    pageProps,
  };
};
