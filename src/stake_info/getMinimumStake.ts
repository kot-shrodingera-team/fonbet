import getMinimumStakeGenerator, {
  minimumStakeReadyGenerator,
} from '@kot-shrodingera-team/germes-generators/stake_info/getMinimumStake';

export const setMinimumStake = (newMinimumStake: number): void => {
  window.germesData.limits.minimumStake = newMinimumStake;
};
export const clearMinimumStake = (): void => {
  window.germesData.limits.minimumStake = undefined;
};

export const minimumStakeReady = minimumStakeReadyGenerator({
  minimumStakeElementSelector:
    '[class*="_min-max"] [class*="info-block__value"]:nth-child(1)',
  // minimumStakeRegex: /(\d+(?:\.\d+)?)/,
  // replaceDataArray: [
  //   {
  //     searchValue: '',
  //     replaceValue: '',
  //   },
  // ],
  // removeRegex: /[\s,']/g,
});

const getMinimumStakeFromCoupon = getMinimumStakeGenerator({
  minimumStakeElementSelector:
    '[class*="_min-max"] [class*="info-block__value"]:nth-child(1)',
  // minimumStakeRegex: /(\d+(?:\.\d+)?)/,
  // replaceDataArray: [
  //   {
  //     searchValue: '',
  //     replaceValue: '',
  //   },
  // ],
  // removeRegex: /[\s,']/g,
});

const getMinimumStake = (): number => {
  if (typeof window.germesData.limits.minimumStake !== 'undefined') {
    return window.germesData.limits.minimumStake;
  }
  return getMinimumStakeFromCoupon();
};

export default getMinimumStake;
