import runArgv from '../runArgv';

test('run argv', async () => {
  const callback = jest.fn(argv => (argv[0] === 'success' ? 0 : 1));

  expect(
    await runArgv(['success', '&&', 'fail', '&&', 'fail', '&&'], callback),
  ).toEqual({
    argv: [],
    exitCode: 1,
  });
  expect(callback).toHaveBeenCalledTimes(2);
});
