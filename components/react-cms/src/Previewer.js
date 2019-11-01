// @flow

import React, { useMemo, useContext, type Node as NodeType } from 'react';
import * as d3 from 'd3-hierarchy';

import SourceContext from './SourceContext';
import Renderer from './Renderer';

const parse = d3
  .stratify()
  .id(({ id }: {| id: string |}) => id)
  .parentId(({ parentId }: {| parentId: string |}) => parentId);

/** @react Use to render the main preview */
const Previewer = (): NodeType => {
  const { source } = useContext(SourceContext);
  const data = useMemo(() => parse(source), [source]);

  return <Renderer source={data} />;
};

export default React.memo<{||}>(Previewer);
