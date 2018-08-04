// @flow

import reset from './__ignore__/reset';
import babel from './__ignore__/babel';
import { root, transformFileOptions } from './__ignore__/constants';

describe('cli', () => {
  test('verbose: true', () => {
    global.console.log = jest.fn();
    reset({
      ...transformFileOptions,
      verbose: true,
    });
    babel();

    expect(global.console.log).toHaveBeenCalled();
    expect(global.console.log).toHaveBeenCalledTimes(2);
    expect(global.console.log).toHaveBeenCalledWith(
      `${root.replace(/^\.\//, '')}/index.js -> lib/index.js.flow`,
    );
    expect(global.console.log).toHaveBeenCalledWith(
      `${root.replace(
        /^\.\//,
        '',
      )}/justDefinition.js.flow -> lib/justDefinition.js.flow`,
    );
  });
});
