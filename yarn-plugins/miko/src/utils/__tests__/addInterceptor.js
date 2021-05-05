import addInterceptor from '../addInterceptor';

const write = jest.fn();
const stdout = { write };

describe('add interceptor', () => {
  beforeEach(() => {
    addInterceptor(stdout);
    write.mockClear();
  });

  test('has interceptor', () => {
    addInterceptor(stdout);

    expect(stdout.write.interceptor).not.toBeUndefined();
  });

  test('remove interceptor after stopping interceptor', () => {
    stdout.write.interceptor.end();

    expect(stdout.write.interceptor).toBeUndefined();
  });

  test('not show `Usage Error`', () => {
    stdout.write('Usage Error');
    stdout.write('test');

    expect(write).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenCalledWith('test', undefined, undefined);
  });

  test('stop interceptor and show `Usage Error`', () => {
    stdout.write.interceptor.end();

    expect(write).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenCalledWith('Usage Error');
  });
});
