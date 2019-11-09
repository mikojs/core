// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';

import React from '@mikojs/koa-react';

const react = new React(path.resolve(__dirname, '../pages'));

describe('pages', () => {
  test.each`
    url    | html
    ${'/'} | ${'<div>@mikojs/create-project</div>'}
  `('page $url', async ({ url, html }: {| url: string, html: string |}) => {
    expect(
      (
        await react.render(url, {
          Loading: emptyFunction.thatReturnsNull,
        })
      ).html(),
    ).toBe(html);
  });
});
