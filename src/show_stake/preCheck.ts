import { awaiter, getElement, log } from '@kot-shrodingera-team/germes-utils';
import {
  checkAccountBlocked,
  accountBlocked,
} from '../initialization/accountChecks';
import appLoaded from '../initialization/appLoaded';
import processCookieModalWindow from '../initialization/processCookieModalWinow';
import JsFailError from './errors/jsFailError';
import NewUrlError from './errors/newUrlError';

const preCheck = async (): Promise<void> => {
  await awaiter(appLoaded);
  if (!appLoaded()) {
    throw new JsFailError('API не загрузилось');
  }
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
    const liveButton = document.querySelector('[href="/live"]') as HTMLElement;
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
  }
  await awaiter(appLoaded);
  if (!appLoaded()) {
    throw new JsFailError('API не загрузилось');
  }
};

export default preCheck;
