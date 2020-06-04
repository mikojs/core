// @flow

import React from 'react';

import { type pageInitialArguType } from '@mikojs/react-ssr';

type propsType = {|
  name?: string,
  params: $PropertyType<
    $PropertyType<pageInitialArguType<>, 'match'>,
    'params',
  >,
|};

/** @react Key Component */
const Key = ({ name = 'Key', params }: propsType) => (
  <div>
    {name}:{JSON.stringify(params)}
  </div>
);

/**
 * @param {pageInitialArguType} context - context data
 *
 * @return {propsType} - initial props
 */
Key.getInitialProps = ({
  match,
}: pageInitialArguType<{| param: string |}>) => ({
  params: match.params,
});

export default React.memo<propsType>(Key);
