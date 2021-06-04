import authorizeGenerator from '@kot-shrodingera-team/germes-generators/initialization/authorize';
import { authElementSelector } from '../stake_info/checkAuth';
import { balanceReady, updateBalance } from '../stake_info/getBalance';
import afterSuccesfulLogin from './afterSuccesfulLogin';

// const setLoginType = async (): Promise<boolean> => {
//   return true;
// };

const authorize = authorizeGenerator({
  openForm: {
    selector: '.header__login-head a.header-btn',
    openedSelector: '#auth_form',
    // loopCount: 10,
    // triesInterval: 1000,
    // afterOpenDelay: 0,
  },
  // setLoginType,
  loginInputSelector: '.login-form__form-row:nth-child(1) input.ui__field',
  passwordInputSelector: '.login-form__form-row:nth-child(2) input.ui__field',
  submitButtonSelector: '#auth_form button[type="submit"]',
  inputType: 'react',
  // fireEventNames: ['input'],
  // beforeSubmitDelay: 0,
  // captchaSelector: '',
  loginedWait: {
    loginedSelector: authElementSelector,
    timeout: 5000,
    balanceReady,
    updateBalance,
    afterSuccesfulLogin,
  },
  context: () => document,
});

export default authorize;
