import getStakeInfoValueGenerator, {
  stakeInfoValueReadyGenerator,
} from '@kot-shrodingera-team/germes-generators/stake_info/getStakeInfoValue';
import { StakeInfoValueOptions } from '@kot-shrodingera-team/germes-generators/stake_info/types';
// import { log } from '@kot-shrodingera-team/germes-utils';
// import getBalance from './getBalance';

export const maximumStakeSelector =
  '[class*="_min-max"] [class*="info-block__value"]:nth-child(3)';

const maximumStakeOptions: StakeInfoValueOptions = {
  name: 'maximumStake',
  // fixedValue: () => getBalance(),
  valueFromText: {
    text: {
      // getText: () => '',
      selector: maximumStakeSelector,
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
  modifyValue: (value: number, extractType: string) => {
    if (worker.Currency === 'RUR') {
      if (value >= 200) {
        // log(
        //   'Считаем максимальную ставку на 100 рублей меньше отображаемой',
        //   'steelblue'
        // );
        return value - 100;
      }
    }
    return value;
  },
  disableLog: false,
};

const getMaximumStake = getStakeInfoValueGenerator(maximumStakeOptions);

export const maximumStakeReady =
  stakeInfoValueReadyGenerator(maximumStakeOptions);

export default getMaximumStake;
