// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';

import React from '../index';

import pagesTestings from './__ignore__/pagesTestings';

describe('client side testing', () => {
  test.each(pagesTestings)(
    'get %s',
    async (urlPath: string, chunkName: string, head: string, main: string) => {
      const isCustom = /custom/.test(urlPath);
      const mockLog = jest.fn();

      global.console.error = mockLog;

      expect(
        (
          await new React(
            isCustom
              ? path.resolve(__dirname, './__ignore__/custom')
              : path.resolve(__dirname, './__ignore__/pages'),
            {
              basename: isCustom ? '/custom' : undefined,
            },
          ).render(urlPath, { Loading: emptyFunction.thatReturnsNull })
        )
          .html()
          .replace(/ style="[\w;:,()\-.%# ]*"/g, '')
          .replace(/<p> .*(<br>)?<\/p>/g, '<p></p>'),
      ).toBe(
        `<div>${main.replace(/<!-- -->/g, '').replace(/&quot;/g, '"')}</div>`,
      );
      (/error/.test(urlPath)
        ? expect(mockLog)
        : expect(mockLog).not
      ).toHaveBeenCalled();
    },
  );
});
