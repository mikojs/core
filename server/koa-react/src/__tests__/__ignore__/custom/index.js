// @flow

import React from 'react';

type propsType = {|
  value: string,
  test: string,
|};

/** @react Home Component */
const Home = ({ value, test }: propsType) => (
  <div>
    {value}-{test}
  </div>
);

/**
 * @example
 * Home.getInitialProps()
 *
 * @return {propsType} - initial props
 */
Home.getInitialProps = () => ({
  test: 'value',
});

export default React.memo<propsType>(Home);
