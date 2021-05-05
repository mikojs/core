import execRace from '../execRace';

describe('exec race', () => {
  test('execute command successfully', async () => {
    expect(await execRace([], {}, () => 0)).toBe(0);
  });

  test('interrupt executing command', async () => {
    expect(
      await execRace([], { stdout: { write: jest.fn() } }, () => 130),
    ).toBe(130);
  });

  test('execute command unsuccessfully', async () => {
    expect(
      await execRace(
        [],
        {},
        () => 1,
        () => 1,
      ),
    ).toBe(1);
  });
});
