// @flow

// $expectError import/order
import order from '../../index';

import eslint from 'eslint';

// $expectError import/no-unresolved
import noUnresolver from '../index';

// $expectError import/first
eslint();

// $expectError import/no-self-import
// $expectError import/default
import noSelfImport from './import';
