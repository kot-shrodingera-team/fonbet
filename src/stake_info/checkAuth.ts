import checkAuthGenerator, {
  authStateReadyGenerator,
} from '@kot-shrodingera-team/germes-generators/stake_info/checkAuth';

export const authStateReady = authStateReadyGenerator({
  noAuthElementSelector: '.header__login-head a.header__link',
  authElementSelector: '.header__login-label',
  logging: true,
  // maxDelayAfterNoAuthElementAppeared: 0,
});

const checkAuth = checkAuthGenerator({
  authElementSelector: '.header__login-label',
});

export default checkAuth;
