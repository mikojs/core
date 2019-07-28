// @flow

import React, {
  type Node as NodeType,
  type ComponentType,
  type Element as ElementType,
} from 'react';
import * as d3 from 'd3-hierarchy';
import { mount } from 'enzyme';

import Dnd from '../index';

import testings from './__ignore__/testings';

type dataType = {|
  id: string,
  parentId: string | null,
  type: string | ComponentType<*>,
  props?: {
    children?: NodeType,
  },
|};

const parse = d3
  .stratify()
  .id((d: dataType) => d.id)
  .parentId((d: dataType) => d.parentId);

describe('dnd', () => {
  test.each(testings)(
    '%s',
    (
      info: string,
      data: $ReadOnlyArray<dataType>,
      expected: ElementType<*>,
    ) => {
      expect(mount(<Dnd source={parse(data)} />).html()).toBe(
        mount(expected).html(),
      );
    },
  );
});
