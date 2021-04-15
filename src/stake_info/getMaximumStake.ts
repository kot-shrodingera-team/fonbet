import getMaximumStakeGenerator, {
  maximumStakeReadyGenerator,
} from '@kot-shrodingera-team/germes-generators/stake_info/getMaximumStake';
import { log } from '@kot-shrodingera-team/germes-utils';

const maximumStakeSelector =
  '[class*="_min-max"] [class*="info-block__value"]:nth-child(3)';
// const maximumStakeRegex = /(\d+(?:\.\d+)?)/;
// const replaceDataArray = [
//   {
//     searchValue: '',
//     replaceValue: '',
//   },
// ];
// const removeRegex = /[\s,']/g;

export const setMaximumStake = (newMaximumStake: number): void => {
  window.germesData.maximumStake = newMaximumStake;
};
export const clearMaximumStake = (): void => {
  window.germesData.maximumStake = undefined;
};

export const maximumStakeReady = maximumStakeReadyGenerator({
  maximumStakeSelector,
  // maximumStakeRegex,
  // replaceDataArray,
  // removeRegex,
  // context: () => document,
});

const getMaximumStakeFromCoupon = getMaximumStakeGenerator({
  maximumStakeSelector,
  // maximumStakeRegex,
  // replaceDataArray,
  // removeRegex,
  // disableLog: false,
  // context: () => document,
});

const getMaximumStake = (): number => {
  if (window.germesData.maximumStake !== undefined) {
    return window.germesData.maximumStake;
  }
  const maximumStakeFromCoupon = getMaximumStakeFromCoupon();
  if (worker.Currency === 'RUR') {
    if (maximumStakeFromCoupon >= 200) {
      log(
        'Считаем максимальную ставку на 100 рубелй меньше отображаемой',
        'steelblue'
      );
      return maximumStakeFromCoupon - 100;
    }
    return maximumStakeFromCoupon;
  }
  return maximumStakeFromCoupon;
};

export default getMaximumStake;
