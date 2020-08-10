import getMinimumStakeGenerator from '@kot-shrodingera-team/germes-generators/stake_info/getMinimumStake';

let minimumStake = -1;

export const setMinimumStake = (newMinimumStake: number): void => {
  minimumStake = newMinimumStake;
};
export const clearMinimumStake = (): void => {
  minimumStake = -1;
};

const getMinimumStakeFromCoupon = getMinimumStakeGenerator({
  minimumStakeElementSelector:
    '._min-max--3iR23 .info-block__value--3QhCK:nth-child(1)',
});

const getMinimumStake = (): number => {
  if (minimumStake !== -1) {
    return minimumStake;
  }
  return getMinimumStakeFromCoupon();
};

export default getMinimumStake;
