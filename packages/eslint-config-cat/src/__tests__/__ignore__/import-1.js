// @flow

// $expectError import/order
import order from '../../index';

import fbjs from 'fbjs';

// $expectError import/no-extraneous-dependencies
import babel from '@babel/core/lib/index';

// $expectError import/no-unresolved
// $expectError import/no-useless-path-segments
import noUnresolver from './../index';

// $expectError import/no-unresolved
// $expectError import/no-absolute-path
import noAbsolutePath from '/etc';

// $expectError import/default
// $expectError import/no-duplicates
import arrowFunc from './import-2';

// $expectError import/default
// $expectError import/no-duplicates
import noDuplicates from './import-2';

// $expectError import/no-named-default
import func, { default as noNamedDefault } from './func';

fbjs();

// $expectError import/newline-after-import
// $expectError import/no-self-import
// $expectError import/first
import * as namespace from './import-1';
fbjs();

fbjs();

// $expectError import/no-named-as-default-member
func.correct();

// $expectError import/namespace
namespace.test();

// $expectError import/no-mutable-exports
export let exportLet: string = 'test';

export default 'export default';
