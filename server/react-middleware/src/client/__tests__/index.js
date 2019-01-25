// @flow

test('can not find main HTMLElement', async () => {
  await expect(require('../index')).rejects.toThrow(
    'Can not find main HTMLElement',
  );
});
