import execRace from '../execRace';
import addInterceptor from '../addInterceptor';

const options = {
  stdout: {
    write: jest.fn(),
  },
};

describe('exec race', () => {
  beforeAll(() => {
    addInterceptor(options.stdout);
    options.stdout.write('Usage Error');
  });

  test('execute command successfully', async () => {
    expect(await execRace([], options, () => 0)).toBe(0);
  });

  test('interrupt executing command', async () => {
    expect(await execRace([], options, () => 130)).toBe(130);
  });

  test('execute command unsuccessfully', async () => {
    expect(
      await execRace(
        [],
        options,
        () => 1,
        () => 1,
      ),
    ).toBe(1);
  });
});
