// @flow

import { type $MaybeType, type $PickType } from '../types';

const testMaybe: $MaybeType<{ a: string }> = {};
(testMaybe: { a?: string });

const testPick: $PickType<{ a: string, b: string }, 'a'> = { a: 'a' };
(testPick: { a: string });
