// @flow

import React from 'react';
import { mount } from 'enzyme';

import client from '../client';
import { type propsType as rootPropsType } from '../Root';

// TODO component should be ignored
// eslint-disable-next-line require-jsdoc, flowtype/require-return-type
const routePage = () => <div>test</div>;
const routeData = {
  exact: true,
  path: ['/'],
  component: {
    loader: async () => ({
      default: routePage,
    }),
    chunkName: 'test',
  },
};

window.__CAT_DATA__ = {
  mainInitialProps: {},
  chunkName: routeData.component.chunkName,
};
window.__CHUNKS_NAMES__ = [routeData.component.chunkName];

describe('client', () => {
  test.each`
    message                            | routesData
    ${'Can not find page component'}   | ${[]}
    ${'Can not find main HTMLElement'} | ${[routeData]}
  `(
    'error with message = $message',
    async ({
      message,
      routesData,
    }: {|
      message: string,
      routesData: $PropertyType<rootPropsType, 'routesData'>,
    |}) => {
      await expect(client(routesData)).rejects.toThrow(message);
    },
  );

  test('work', async () => {
    const main = global.document.createElement('main');

    main.setAttribute('id', '__CAT__');
    global.document.querySelector('body').appendChild(main);

    const Page = await client([routeData]);

    expect(mount(<Page />).contains(routePage())).toBeTruthy();
  });
});
