// @flow

export type badgeType = {
  [string]: string,
  filterFunc?: (result: boolean) => boolean,
};

/**
 * @param {badgeType} badges - badges data
 *
 * @return {string} - badges string
 */
export default (badges: $ReadOnlyArray<badgeType>): string =>
  `${badges
    .map(({ badgeName, link }: badgeType) =>
      !link
        ? `![${badgeName}][${badgeName}-image]`
        : `[![${badgeName}][${badgeName}-image]][${badgeName}-link]`,
    )
    .join(' ')}

${badges
  .map(
    ({ badgeName, image, link }: badgeType) =>
      `[${badgeName}-image]: ${image}${
        !link ? '' : `\n[${badgeName}-link]: ${link}`
      }`,
  )
  .join('\n')}

`;
