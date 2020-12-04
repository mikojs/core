// @flow

import React, {
  type Node as NodeType,
  type ComponentType,
  type Context as ContextType,
} from 'react';

type themeContextType = {|
  error: string,
|};

type propsType = {|
  config: themeContextType,
  children: NodeType,
|};

export const ThemeContext: ContextType<themeContextType> = React.createContext<themeContextType>(
  {
    error: 'red',
  },
);

/** @react theme provider */
const Theme = ({ config, children }: propsType) => (
  <ThemeContext.Provider value={config}>{children}</ThemeContext.Provider>
);

export default (React.memo<propsType>(Theme): ComponentType<propsType>);
