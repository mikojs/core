// @flow

import { mockChoice } from '@cat-org/utils';
import logger, { findSettings } from '@cat-org/logger';

const oraSettings = findSettings('ora');
const { error } = console;

oraSettings.fail.after = () => {
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

export default logger('@cat-org/create-project', oraSettings).init();
