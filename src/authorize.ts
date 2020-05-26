import {
  awaiter,
  fireEvent,
  getElement,
} from '@kot-shrodingera-team/config/util';
import { setReactInputValue } from '@kot-shrodingera-team/config/reactUtils';
import processCookieModalWinow from './processCookieModalWinow';
import accountBlocked from './accountChecks';
import checkLogin from './stakeInfo/checkLogin';
import updateBalance from './stakeInfo/updateBalance';

const authorize = async (): Promise<void> => {
  const lineLoaded = await awaiter(
    // eslint-disable-next-line no-underscore-dangle
    () => app && app.lineManager && app._ready === true
  );
  if (!lineLoaded) {
    worker.Helper.WriteLine('Линия так и не загрузилась');
    worker.Islogin = false;
    worker.JSLogined();
    return;
  }
  processCookieModalWinow();

  worker.Islogin = await awaiter(checkLogin);
  worker.JSLogined();
  if (worker.Islogin) {
    updateBalance();
    worker.Helper.WriteLine('Есть авторизация');
    if (
      !window.devStuff.dontCheckBlocked &&
      app.session.attributes.liveBlocked
    ) {
      accountBlocked();
    }
    return;
  }
  worker.Helper.WriteLine('Нет авторизации');

  const openLoginFormButton = (await getElement(
    '.header__login-head a.header__link'
  )) as HTMLElement;
  if (!openLoginFormButton) {
    worker.Helper.WriteLine(
      'Ошибка авторизации: Не найдена кнопка "Войти" в верхнем тулбаре'
    );
    return;
  }

  openLoginFormButton.click();

  const authForm = await getElement('#auth_form');
  if (!authForm) {
    worker.Helper.WriteLine(
      'Ошибка авторизации: Фора авторизации не появилась'
    );
    return;
  }

  worker.LoginTry += 1;

  const loginInput = await getElement(
    '.login-form__form-row:nth-child(1) input.ui__field'
  );
  if (!loginInput) {
    worker.Helper.WriteLine('Ошибка авторизации: Не найдено поля ввода логина');
    return;
  }
  const passwordInput = await getElement(
    '.login-form__form-row:nth-child(2) input.ui__field'
  );
  if (!passwordInput) {
    worker.Helper.WriteLine('Ошибка авторизации: Не найдено поля ввода пароля');
    return;
  }
  const loginSubmitButton = (await getElement(
    'button[type="submit"]',
    1000,
    authForm
  )) as HTMLElement;
  if (!loginSubmitButton) {
    worker.Helper.WriteLine('Ошибка авторизации: Не найдена кнопка "Войти"');
    return;
  }

  setReactInputValue(loginInput, worker.Login);
  setReactInputValue(passwordInput, worker.Password);
  loginSubmitButton.click();

  await Promise.race([awaiter(checkLogin), getElement('.login-form__error')]);
  const loginError = document.querySelector('.login-form__error');
  if (loginError) {
    worker.Helper.WriteLine(`Ошибка авторизации: '${loginError.textContent}'`);
    return;
  }
  worker.Islogin = checkLogin();
  worker.JSLogined();
  if (!worker.Islogin) {
    worker.Helper.WriteLine('Авторизация не удалась');
    return;
  }
  worker.Helper.WriteLine('Успешная авторизация');
  // window.location.reload(true);
};

export default authorize;
