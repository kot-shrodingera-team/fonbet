import getMaximumStakeGenerator, {
  maximumStakeReadyGenerator,
} from '@kot-shrodingera-team/germes-generators/stake_info/getMaximumStake';

export const setMaximumStake = (newMaximumStake: number): void => {
  window.germesData.limits.maximumStake = newMaximumStake;
};
export const clearMaximumStake = (): void => {
  window.germesData.limits.maximumStake = undefined;
};

export const maximumStakeReady = maximumStakeReadyGenerator({
  maximumStakeElementSelector:
    '[class*="_min-max"] [class*="info-block__value"]:nth-child(3)',
  // maximumStakeRegex: /(\d+(?:\.\d+)?)/,
  // replaceDataArray: [
  //   {
  //     searchValue: '',
  //     replaceValue: '',
  //   },
  // ],
  // removeRegex: /[\s,']/g,
});

const getMaximumStakeFromCoupon = getMaximumStakeGenerator({
  maximumStakeElementSelector:
    '[class*="_min-max"] [class*="info-block__value"]:nth-child(3)',
  // maximumStakeRegex: /(\d+(?:\.\d+)?)/,
  // replaceDataArray: [
  //   {
  //     searchValue: '',
  //     replaceValue: '',
  //   },
  // ],
  // removeRegex: /[\s,']/g,
});

const getMaximumStake = (): number => {
  if (typeof window.germesData.limits.maximumStake !== 'undefined') {
    return window.germesData.limits.maximumStake;
  }
  const maximumStakeFromCoupon = getMaximumStakeFromCoupon();
  if (worker.Currency === 'RUR') {
    if (maximumStakeFromCoupon >= 200) {
      return maximumStakeFromCoupon - 100;
    }
    return maximumStakeFromCoupon;
  }
  return maximumStakeFromCoupon;
};

export default getMaximumStake;
