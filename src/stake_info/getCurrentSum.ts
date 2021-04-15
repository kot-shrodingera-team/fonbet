import getCurrentSumGenerator from '@kot-shrodingera-team/germes-generators/stake_info/getCurrentSum';

export const sumInputSelector = 'input[class*="sum-panel__input"]';

const getCurrentSum = getCurrentSumGenerator({
  sumInputSelector,
  // zeroValues: [],
  // replaceDataArray: [
  //   {
  //     searchValue: '',
  //     replaceValue: '',
  //   },
  // ],
  // removeRegex: /[\s,']/g,
  // currentSumRegex: /(\d+(?:\.\d+)?)/,
  // context: () => document,
});

export default getCurrentSum;
