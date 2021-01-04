import getMaximumStakeGenerator from '@kot-shrodingera-team/germes-generators/stake_info/getMaximumStake';

let maximumStake = -1;

export const setMaximumStake = (newMaximumStake: number): void => {
  maximumStake = newMaximumStake;
};
export const clearMaximumStake = (): void => {
  maximumStake = -1;
};

const getMaximumStakeFromCoupon = getMaximumStakeGenerator({
  maximumStakeElementSelector:
    '._min-max--3iR23 .info-block__value--3QhCK:nth-child(3)',
});

const getMaximumStake = (): number => {
  if (maximumStake !== -1) {
    return maximumStake;
  }
  const maximumStakeFromCoupon = getMaximumStakeFromCoupon();
  if (worker.Currency === 'RUR') {
    return maximumStakeFromCoupon - 100;
  }
  return maximumStakeFromCoupon;
};

export default getMaximumStake;
