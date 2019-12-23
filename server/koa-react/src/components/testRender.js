// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { mount, type ReactWrapper as reactWrapperType } from 'enzyme';
import { MemoryRouter as Router, Link } from 'react-router-dom';

import Root, { type propsType } from './Root';

export type wrapperType = reactWrapperType<typeof Router>;

/**
 * @example
 * testRender(props)
 *
 * @param {propsType} props - the props to render the component
 * @param {string} to - the link to render the first page
 *
 * @return {reactWrapperType} - testing wrapper component
 */
export default async (
  props: propsType<{}, { to?: string }>,
  to?: string,
): Promise<wrapperType> => {
  // FIXME: https://github.com/facebook/flow/issues/2977
  const newProps = { ...props };

  if (to) {
    newProps.InitialPage = Link;
    newProps.pageInitialProps = { to };
  }

  const wrapper = mount<typeof Router>(
    <Router initialEntries={[to === '/' ? 'initialUrl' : '/']}>
      <Root {...newProps} />
    </Router>,
  );

  if (to) {
    // TODO: modify, https://github.com/airbnb/enzyme/issues/2171
    await act(async () => {
      Simulate.click(
        // $FlowFixMe
        ReactDOM.findDOMNode(wrapper.find('a').instance()),
        { button: 0 },
      );
    });

    // TODO: modify, https://github.com/airbnb/enzyme/issues/2171
    wrapper.update();
  }

  return wrapper;
};
