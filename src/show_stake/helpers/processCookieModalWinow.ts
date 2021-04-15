import { log } from '@kot-shrodingera-team/germes-utils';

const processCookieModalWindow = (): void => {
  const cookieModalWindow = document.querySelector('._cookie-policy');
  if (cookieModalWindow) {
    log('Есть окно с сообщением о Cookies', 'steelblue');
    const acceptCookies = document.querySelector(
      '._cookie-policy ~ .modal-window__button-area a.modal-window__button'
    ) as HTMLElement;
    if (acceptCookies) {
      log('Нажимаем кнопку "Согласен"', 'orange');
      acceptCookies.click();
    } else {
      log('Не найдена кнопка "Согласен"', 'crimson');
    }
  }
};

export default processCookieModalWindow;
