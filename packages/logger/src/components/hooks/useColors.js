// @flow

import { useRef, useMemo } from 'react';

type colorsType = {|
  [string]: string,
|};

/**
 * @param {string} name - logger name
 *
 * @return {colorsType} - logger colors
 */
export default (name: string): colorsType => {
  const colorsRef = useRef<colorsType>({});

  return useMemo((): colorsType => {
    if (!colorsRef.current[name])
      colorsRef.current = {
        ...colorsRef.current,
        [name]: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      };

    return colorsRef.current;
  }, [name]);
};
