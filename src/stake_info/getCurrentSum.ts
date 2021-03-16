import getCurrentSumGenerator from '@kot-shrodingera-team/germes-generators/stake_info/getCurrentSum';

const getCurrentSum = getCurrentSumGenerator({
  sumInput: 'input[class*="sum-panel__input"]',
  // zeroValues: [],
  // currentSumRegex: /(\d+(?:\.\d+)?)/,
});

export default getCurrentSum;
