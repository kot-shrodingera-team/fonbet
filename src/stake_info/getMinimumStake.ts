import getStakeInfoValueGenerator, {
  stakeInfoValueReadyGenerator,
} from '@kot-shrodingera-team/germes-generators/stake_info/getStakeInfoValue';
import { StakeInfoValueOptions } from '@kot-shrodingera-team/germes-generators/stake_info/types';

export const minimumStakeSelector =
  '[class*="_min-max"] [class*="info-block__value"]:nth-child(1)';

const minimumStakeOptions: StakeInfoValueOptions = {
  name: 'minimumStake',
  // fixedValue: () => 0,
  valueFromText: {
    text: {
      // getText: () => '',
      selector: minimumStakeSelector,
      context: () => document,
    },
    replaceDataArray: [
      {
        searchValue: '',
        replaceValue: '',
      },
    ],
    removeRegex: /[\s,']/g,
    matchRegex: /(\d+(?:\.\d+)?)/,
    errorValue: 0,
  },
  zeroValues: [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  modifyValue: (value: number, extractType: string) => value,
  disableLog: false,
};

const getMinimumStake = getStakeInfoValueGenerator(minimumStakeOptions);

export const minimumStakeReady =
  stakeInfoValueReadyGenerator(minimumStakeOptions);

export default getMinimumStake;
