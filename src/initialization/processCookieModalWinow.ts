import { log } from '@kot-shrodingera-team/germes-utils';

const processCookieModalWindow = (): void => {
  const cookieModalWindow = document.querySelector('#cookie_policy_popup');
  if (cookieModalWindow) {
    log('Есть окно с сообщением о Cookies', 'steelblue');
    const acceptCookies = document.querySelector(
      'a[class*="modal-window__button"]'
    ) as HTMLElement;
    if (acceptCookies) {
      acceptCookies.click();
      log('Нажали "Принять Coockies"', 'orange');
    } else {
      log('Нет кнопки "Принять Cookies"', 'crimson');
    }
  }
};

export default processCookieModalWindow;
