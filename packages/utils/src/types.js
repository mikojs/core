// @flow
/* eslint-disable flowtype/type-id-match */
export type $MaybeType<T, K = $Keys<T>> = { [K]: $ElementType<T, K> };

export type $PickType<T, K> = { [K]: $ElementType<T, K> };
