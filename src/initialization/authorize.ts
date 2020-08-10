import authorizeGenerator from '@kot-shrodingera-team/germes-generators/initialization/authorize';
import afterSuccesfulLogin from './afterSuccesfulLogin';

const authorize = authorizeGenerator({
  openForm: {
    selector: '.header__login-head a.header__link',
    openedSelector: '#auth_form',
  },
  loginInputSelector: '.login-form__form-row:nth-child(1) input.ui__field',
  passwordInputSelector: '.login-form__form-row:nth-child(2) input.ui__field',
  submitButtonSelector: '#auth_form button[type="submit"]',
  inputType: 'react',
  afterSuccesfulLogin,
});

export default authorize;