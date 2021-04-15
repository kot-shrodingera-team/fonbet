import getMinimumStakeGenerator, {
  minimumStakeReadyGenerator,
} from '@kot-shrodingera-team/germes-generators/stake_info/getMinimumStake';

const minimumStakeSelector =
  '[class*="_min-max"] [class*="info-block__value"]:nth-child(1)';
// const minimumStakeRegex = /(\d+(?:\.\d+)?)/;
// const replaceDataArray = [
//   {
//     searchValue: '',
//     replaceValue: '',
//   },
// ];
// const removeRegex = /[\s,']/g;

export const setMinimumStake = (newMinimumStake: number): void => {
  window.germesData.minimumStake = newMinimumStake;
};
export const clearMinimumStake = (): void => {
  window.germesData.minimumStake = undefined;
};

export const minimumStakeReady = minimumStakeReadyGenerator({
  minimumStakeSelector,
  // minimumStakeRegex,
  // replaceDataArray,
  // removeRegex,
  // context: () => document,
});

const getMinimumStakeFromCoupon = getMinimumStakeGenerator({
  minimumStakeSelector,
  // minimumStakeRegex,
  // replaceDataArray,
  // removeRegex,
  // disableLog: false,
  // context: () => document,
});

const getMinimumStake = (): number => {
  if (window.germesData.minimumStake !== undefined) {
    return window.germesData.minimumStake;
  }
  return getMinimumStakeFromCoupon();
};

export default getMinimumStake;
