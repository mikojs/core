// @flow

type loadingTriggerType = (type: 'start' | 'complete') => void;

export type loadingPropsType = {|
  event: {|
    trigger: loadingTriggerType,
    on: (
      trigger: $PropertyType<
        $PropertyType<loadingPropsType, 'event'>,
        'trigger',
      >,
    ) => void,
  |},
|};

export type errorPropsType = {|
  error: Error,
  errorInfo: {
    componentStack: string,
  },
|};

export type ctxType<T = {}> = {|
  ctx: {|
    path: string,
    querystring: string,
    url: string,
    originalUrl: string,
    origin: string,
    href: string,
    host: string,
    hostname: string,
    protocol: string,
  |} & T,
  isServer: boolean,
|};
