// @flow

import badges, { type ctxType, type badgeType } from './badges';

/**
 * @param {ctxType} ctx - context value
 *
 * @return {string} - badges string
 */
export default (ctx: ctxType): string => {
  const usedBadges = badges.filter(({ skip }: badgeType) => !skip(ctx));

  return `${usedBadges
    .map(({ name, link }: badgeType) =>
      !link
        ? `![${name}][${name}-image]`
        : `[![${name}][${name}-image]][${name}-link]`,
    )
    .join(' ')}

${usedBadges
  .map(
    ({ name, image, link }: badgeType) =>
      `[${name}-image]: ${image}${!link ? '' : `\n[${name}-link]: ${link}`}`,
  )
  .join('\n')}

`;
};
