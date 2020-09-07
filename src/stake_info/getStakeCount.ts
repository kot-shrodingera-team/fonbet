import getStakeCountGenerator from '@kot-shrodingera-team/germes-generators/stake_info/getStakeCount';

const getStakeCount = getStakeCountGenerator({
  stakeElementSelector: '.stake-wide--1XHB_, .stake-narrow--3wROh',
});

export default getStakeCount;
