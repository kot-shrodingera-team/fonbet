import authCheckReadyGenerator from '@kot-shrodingera-team/germes-generators/initialization/authCheckReady';

const authCheckReady = authCheckReadyGenerator({
  authFormSelector: '.header__login-head a.header__link',
  accountSelector: '.header__login-label',
});

export default authCheckReady;
