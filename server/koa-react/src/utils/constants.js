// @flow

import { type ComponentType } from 'react';

import { requireModule } from '@cat-org/utils';

import { type lazyComponentType } from '../ReactIsomorphic';
import { type errorPropsType } from '../types';

import Document from 'templates/Document';
import Main from 'templates/Main';
import Loading from 'templates/Loading';
import ErrorComponent from 'templates/Error';

/**
 * @example
 * serverRequire(Component)
 *
 * @param {ComponentType} PageComponent - page component
 *
 * @return {Promise<{ default: ComponentType }>} - lazy component
 */
const serverRequire = (PageComponent: ComponentType<*>) => async () => ({
  default: PageComponent,
});

export default ({
  routesData: [
    {
      exact: true,
      path: ['/*'],
      component: {
        loader: serverRequire(requireModule('../templates/NotFound')),
        chunkName: 'pages/notFound',
      },
    },
  ],
  Document,
  Main,
  Loading,
  ErrorComponent,
}: {
  routesData: $ReadOnlyArray<{|
    exact: true,
    path: $ReadOnlyArray<string>,
    component: {|
      loader: lazyComponentType,
      chunkName: string,
    |},
  |}>,
  Document: ComponentType<*>,
  Main: ComponentType<*>,
  Loading: ComponentType<{||}>,
  ErrorComponent: ComponentType<errorPropsType>,
});
