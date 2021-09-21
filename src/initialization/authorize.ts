import authorizeGenerator from '@kot-shrodingera-team/germes-generators/initialization/authorize';
// import {
//   getElement,
//   log,
//   resolveRecaptcha,
// } from '@kot-shrodingera-team/germes-utils';
import { authElementSelector } from '../stake_info/checkAuth';
import { balanceReady, updateBalance } from '../stake_info/getBalance';
import afterSuccesfulLogin from './afterSuccesfulLogin';

// const preInputCheck = async (): Promise<boolean> => {
//   return true;
// };

// const beforeSubmitCheck = async (): Promise<boolean> => {
//   // const recaptchaIFrame = await getElement('iframe[title="reCAPTCHA"]', 1000);
//   // if (recaptchaIFrame) {
//   //   log('Есть капча. Пытаемся решить', 'orange');
//   //   try {
//   //     await resolveRecaptcha();
//   //   } catch (e) {
//   //     if (e instanceof Error) {
//   //       log(e.message, 'red');
//   //     }
//   //     return false;
//   //   }
//   // } else {
//   //   log('Нет капчи', 'steelblue');
//   // }
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
  // preInputCheck,
  loginInputSelector: '.login-form__form-row:nth-child(1) input',
  passwordInputSelector: '.login-form__form-row:nth-child(2) input',
  submitButtonSelector: '#auth_form button[type="submit"]',
  inputType: 'react',
  // fireEventNames: ['input'],
  // beforeSubmitDelay: 0,
  // beforeSubmitCheck,
  // captchaSelector: '',
  loginedWait: {
    loginedSelector: authElementSelector,
    timeout: 5000,
    balanceReady,
    updateBalance,
    afterSuccesfulLogin,
  },
  // context: () => document,
});

export default authorize;
