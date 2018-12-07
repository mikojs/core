// @flow

import { mockChoice } from '@cat-org/utils';
import logger, { findSettings } from '@cat-org/logger';

const logSettings = findSettings('log');
const { error } = console;

logSettings.fail.after = () => {
  error();
  mockChoice(
    process.env.NODE_ENV === 'test',
    () => {
      throw new Error('process exit');
    },
    process.exit,
    1,
  );
};

export default logger('cli', logSettings);
