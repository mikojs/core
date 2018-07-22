// @flow

import type { testType } from './definitions/index.js.flow';
import type { fooType } from './definitions/foo.js.flow';

import index from './index';

('test': testType);
('foo': fooType);
(index: testType);
