// @flow

import getPort from 'get-port';

import server from '../server';

test('server', async () => {
  (await server({ port: await getPort() })).close();
});
