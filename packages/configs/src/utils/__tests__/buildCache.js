// @flow

import buildCache from '../buildCache';

test('build cache', () => {
  const cache = buildCache();

  cache.addConfig({ cli: {} });
  cache.addConfig({
    cli: {
      alias: 'value',
      env: { key: 'value' },
      configsFiles: { key: 'value' },
    },
  });

  expect(cache.get('cli').alias).toEqual('value');
  expect(cache.get('cli').install([])).toEqual([]);
  expect(cache.get('cli').config({})).toEqual({});
  expect(cache.get('cli').ignore({})).toEqual({});
  expect(cache.get('cli').run([])).toEqual([]);
  expect(cache.get('cli').env).toEqual({ key: 'value' });
  expect(cache.get('cli').configsFiles).toEqual({ key: 'value' });
});
