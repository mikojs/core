// @flow

test('can not find main HTMLElement', async () => {
  await expect(require('../client')).rejects.toThrow(
    'Can not find main HTMLElement',
  );
});
