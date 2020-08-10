import checkAuthGenerator from '@kot-shrodingera-team/germes-generators/stake_info/checkAuth';

const checkAuth = checkAuthGenerator({
  accountSelector: '.header__login-label',
});

export default checkAuth;
