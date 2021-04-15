import checkAuthGenerator, {
  authStateReadyGenerator,
} from '@kot-shrodingera-team/germes-generators/stake_info/checkAuth';

export const noAuthElementSelector = '.header__login-head a.header__link';
export const authElementSelector = '.header__login-label';

export const authStateReady = authStateReadyGenerator({
  noAuthElementSelector,
  authElementSelector,
  // maxDelayAfterNoAuthElementAppeared: 0,
  // context: () => document,
});

const checkAuth = checkAuthGenerator({
  authElementSelector,
  // context: () => document,
});

export default checkAuth;
