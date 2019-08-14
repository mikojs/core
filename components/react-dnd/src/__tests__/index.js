/**
 * @jest-environment node
 *
 * @flow
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import Dnd from '../index';

test('react-dnd', () => {
  expect(renderToStaticMarkup(<Dnd />)).toMatch(/<main .*><\/main>/);
});
