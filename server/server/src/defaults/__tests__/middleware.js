// @flow

import context from 'koa/lib/context';

import middleware from '../middleware';

test('middleware', async () => {
  const mockNext = jest.fn();

  await middleware(context, mockNext);

  expect(mockNext).toHaveBeenCalled();
});
