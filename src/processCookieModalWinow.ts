const processCookieModalWinow = (): void => {
  const cookieModalWindow = document.querySelector('#cookie_policy_popup');
  if (cookieModalWindow) {
    worker.Helper.WriteLine('Есть окно с сообщением о Coockies');
    const acceptCookies = document.querySelector(
      'a[class*="modal-window__button"]'
    ) as HTMLElement;
    if (acceptCookies) {
      acceptCookies.click();
      worker.Helper.WriteLine('Нажали "Принять Coockies"');
    } else {
      worker.Helper.WriteLine('Нет кнопки "Принять Coockies"');
    }
  }
};

export default processCookieModalWinow;
