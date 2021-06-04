import {
  awaiter,
  checkBookerHost,
  getElement,
  log,
} from '@kot-shrodingera-team/germes-utils';
import {
  NewUrlError,
  JsFailError,
} from '@kot-shrodingera-team/germes-utils/errors';
import checkAuth, { authStateReady } from '../stake_info/checkAuth';
import { balanceReady, updateBalance } from '../stake_info/getBalance';
import { checkAccountBlocked, accountBlocked } from './helpers/accountChecks';
import checkAppLoaded from './helpers/checkAppLoaded';
import processCookieModalWindow from './helpers/processCookieModalWinow';

const preOpenEvent = async (): Promise<void> => {
  if (!checkBookerHost()) {
    log('Открыта не страница конторы (или зеркала)', 'crimson');
    window.location.href = new URL(worker.BookmakerMainUrl).href;
    throw new NewUrlError('Открываем страницу БК');
  }

  const appLoaded = await awaiter(checkAppLoaded);
  if (!appLoaded) {
    throw new JsFailError('API не загрузилось');
  }

  await authStateReady();
  worker.Islogin = checkAuth();
  worker.JSLogined();
  if (!worker.Islogin) {
    throw new JsFailError('Нет авторизации');
  }
  log('Есть авторизация', 'steelblue');
  await balanceReady();
  updateBalance();

  if (checkAccountBlocked()) {
    accountBlocked();
    throw new JsFailError('accountBlocked');
  }
  processCookieModalWindow();

  if (app.accountManager.needVerification()) {
    log('Необходима верификация', 'orange');
  }
  const { pathname } = window.location;
  if (!pathname.startsWith('/live') && !pathname.startsWith('/bets')) {
    log('Не на странице линии или лайва', 'steelblue');
    const liveButton = document.querySelector<HTMLElement>('[href="/live"]');
    if (!liveButton) {
      log('Не найдена кнопка перехода на лайв', 'crimson');
      log('Переходим на лайв по URL', 'orange');
      window.location.href = new URL('/live', worker.BookmakerMainUrl).href;
      throw new NewUrlError('Переходим на лайв по URL');
    }
    log('Переходим на лайв по кнопке', 'orange');
    liveButton.click();
    const betsTable = await getElement(
      '[class^="line-filter-layout__content"]'
    );
    if (!betsTable) {
      throw new JsFailError('Не найдена таблица ставок');
    }
    log('Появилась таблица ставок', 'steelblue');

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const appLoaded = await awaiter(checkAppLoaded);
    if (!appLoaded) {
      throw new JsFailError('API не загрузилось');
    }
  }
};

export default preOpenEvent;
