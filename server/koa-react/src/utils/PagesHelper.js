// @flow

import React, { type ComponentType, type Node as NodeType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { matchRoutes } from 'react-router-config';
import { type ContextRouter as contextRouterType } from 'react-router-dom';
import { type Context as koaContextType } from 'koa';
import { ExecutionEnvironment } from 'fbjs';

import { lazy, type lazyComponentType } from '../ReactIsomorphic';

/**
 * @example
 * initComponent()
 */
const initComponent = () => {
  throw new Error('Can not use init Component');
};

/** Pages helper to control the Pages */
export default class PagesHelper {
  +routesData: $ReadOnlyArray<{|
    exact: true,
    path: $ReadOnlyArray<string>,
    component: {|
      filePath: string,
      chunkName: string,
      loader: lazyComponentType,
    |},
  |}>;

  originalUrl: string = '';
  chunkName: string = '';
  initialProps: {
    head?: NodeType,
  } = {};
  Component: ComponentType<*> = initComponent;
  Page: $Call<typeof lazy, lazyComponentType, string> = initComponent;
  lazyPage: lazyComponentType = initComponent;

  /**
   * @example
   * new PagesHelper([])
   *
   * @param {Array} routesData - routes data
   */
  constructor(routesData: $PropertyType<PagesHelper, 'routesData'>) {
    this.routesData = routesData;
  }

  /**
   * @example
   * pagesHelper.getPage(routsData, ctx)
   *
   * @param {{ location: object, staticContext: koaContextType }} Context - getInitialProps context
   *
   * @return {ComponentType} - page component
   */
  +getPage = ({
    location: { pathname, search },
    staticContext,
  }: {
    location: $Diff<
      $PropertyType<contextRouterType, 'location'>,
      { state: mixed, hash: mixed },
    >,
    staticContext?: koaContextType,
  }): $PropertyType<PagesHelper, 'Page'> => {
    const ctx = {
      ctx: staticContext || {
        path: pathname,
        querystring: search.replace(/\?/, ''),
        originalUrl: `${pathname}${search}`,
        origin: window.location.origin,
        href: window.location.href,
        host: window.location.host,
        hostname: window.location.hostname,
        protocol: window.location.protocol,
      },
      isServer: !ExecutionEnvironment.canUseEventListeners,
    };

    if (this.originalUrl !== ctx.ctx.originalUrl) {
      const [
        {
          route: {
            component: { loader, chunkName },
          },
          match,
        },
      ] = matchRoutes(this.routesData, ctx.ctx.path);

      /**
       * @example
       * lazyPage()
       *
       * @return {ComponentType} - return Page
       */
      const lazyPage = async (): $Call<lazyComponentType> => {
        const { default: Component } = await loader();
        const { head, ...initialProps } =
          // $FlowFixMe Flow does not yet support method or property calls in optional chains.
          (await Component.getInitialProps?.({ ...ctx, match })) || {};
        /** @react render the page */
        const Page = <-P: {}>(props?: P) => (
          <Component {...props} {...initialProps} />
        );

        if (!ctx.isServer) renderToStaticMarkup(head || null);

        this.originalUrl = ctx.ctx.originalUrl;
        this.chunkName = chunkName;
        this.Component = Component;
        this.initialProps = {
          ...initialProps,
          head,
        };

        return { default: Page };
      };

      this.Page = lazy(lazyPage, chunkName);
      this.lazyPage = lazyPage;
    }

    return this.Page;
  };
}
