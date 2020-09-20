// @flow

type eventType = 'dev' | 'prod' | 'start';

/**
 * @return {object} - server event object
 */
const buildCache = (): ({|
  set: (type: eventType) => void,
  get: () => eventType,
|}) => {
  const cache = {
    type: 'dev',
  };

  return {
    /**
     * @param {eventType} type - server event type
     */
    set: (type: eventType) => {
      cache.type = type;
    },

    /**
     * @return {eventType} - server event type
     */
    get: () => cache.type,
  };
};

export default buildCache();
