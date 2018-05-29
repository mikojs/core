// @flow

import { moduleA, moduleB, moduleC } from 'eslint';
import {
  moduleAA,
  moduleBB,
  moduleCC,
  moduleDD,
} from '@babel/core';

// $expectError object-curly-newline
// $expectError object-curly-newline
import { moduleAAA, moduleBBB, moduleCCC, moduleDDD } from '@babel/cli';

// $expectError object-curly-spacing
import {moduleAAAA } from '@babel/preset-env';

// $expectError object-curly-spacing
import { moduleAAAAA} from '@babel/preset-flow';

const testA = { keyA: 'a', keyB: 'b', keyC: 'c' };
const testB = {
  keyAA: 'a',
  keyBB: 'b',
  keyCC: 'c',
  keyDD: 'd',
};

const { keyA, keyB, keyC } = testA;
const {
  keyAA,
  keyBB,
  keyCC,
  keyDD,
} = testB;

// $expectError object-curly-newline
// $expectError object-curly-newline
const { keyAAA, keyBBB, keyCCC, keyDDD } = moduleA;

// $expectError object-curly-spacing
const {keyAAAA } = moduleA;

// $expectError object-curly-spacing
const { keyAAAAA} = moduleA;
