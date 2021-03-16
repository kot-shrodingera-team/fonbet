import getStakeCountGenerator from '@kot-shrodingera-team/germes-generators/stake_info/getStakeCount';

const getStakeCount = getStakeCountGenerator({
  stakeElementSelector: '[class*="stake-wide"], [class*="stake-narrow"]',
});

export default getStakeCount;
