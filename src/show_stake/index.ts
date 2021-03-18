import {
  checkUrl,
  getWorkerParameter,
  log,
} from '@kot-shrodingera-team/germes-utils';
import { updateBalance } from '../stake_info/getBalance';
import checkAuth, { authStateReady } from '../stake_info/checkAuth';
import clearCoupon from './clearCoupon';
import setBetAcceptMode from './setBetAcceptMode';
import JsFailError from './errors/jsFailError';
import NewUrlError from './errors/newUrlError';
import openBet from './openBet';
import openEvent from './openEvent';
import preCheck from './preCheck';
import getMaximumStake from '../stake_info/getMaximumStake';

let couponOpenning = false;

export const isCouponOpenning = (): boolean => couponOpenning;

const showStake = async (): Promise<void> => {
  localStorage.setItem('couponOpening', '1');
  couponOpenning = true;
  try {
    if (!checkUrl()) {
      log('Открыта не страница конторы (или зеркала)', 'crimson');
      window.location.href = new URL(worker.BookmakerMainUrl).href;
      throw new NewUrlError('Открывает страницу БК');
    }

    await authStateReady();
    worker.Islogin = checkAuth();
    worker.JSLogined();
    if (!worker.Islogin) {
      throw new JsFailError('Нет авторизации');
    }
    log('Есть авторизация', 'steelblue');

    const couponCleared = await clearCoupon();
    if (!couponCleared) {
      throw new JsFailError('Не удалось очистить купон');
    }
    updateBalance();

    await preCheck();

    await openEvent();

    await openBet();

    const accountRestrictionByMaximumStake = getWorkerParameter(
      'accountRestrictionByMaximumStake'
    );
    if (accountRestrictionByMaximumStake) {
      const maximumStake = getMaximumStake();
      if (maximumStake <= 500) {
        const paused =
          worker.SetBookmakerPaused && worker.SetBookmakerPaused(true);
        let message = `В Фонбете максмальная сумма ставки ${maximumStake} <= 500. Считаем что аккаунт порезан\n`;
        if (paused) {
          message = `${message}Поставили на паузу`;
        } else {
          message = `${message}НЕ удалось поставить на паузу`;
        }
        worker.Helper.SendInformedMessage(message);
        throw new JsFailError(message);
      }
    }

    log('Ставка успешно открыта', 'green');
    setBetAcceptMode();
    couponOpenning = false;
    localStorage.setItem('couponOpening', '0');
    worker.JSStop();
  } catch (error) {
    if (error instanceof JsFailError) {
      log(error.message, 'red');
      couponOpenning = false;
      localStorage.setItem('couponOpening', '0');
      worker.JSFail();
    }
    if (error instanceof NewUrlError) {
      log(error.message, 'orange');
    }
  }
};

export default showStake;
