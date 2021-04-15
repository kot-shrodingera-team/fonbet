import getStakeCountGenerator from '@kot-shrodingera-team/germes-generators/stake_info/getStakeCount';

const getStakeCount = getStakeCountGenerator({
  stakeSelector: '[class*="stake-wide"]',
  // context: () => document,
});

export default getStakeCount;
