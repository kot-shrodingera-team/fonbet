import { log, awaiter, getElement } from '@kot-shrodingera-team/germes-utils';
import { updateBalance, balanceReady } from '../stake_info/getBalance';
import {
  checkAccountBlocked,
  accountBlocked,
} from '../initialization/accountChecks';
import getStakeCount from '../stake_info/getStakeCount';
import checkBet from '../check_bet';
import checkAuth from '../stake_info/checkAuth';
import authCheckReady from '../initialization/authCheckReady';
import clearCoupon from './clearCoupon';
import appLoaded from '../initialization/appLoaded';
import processCookieModalWindow from '../initialization/processCookieModalWinow';
import setBetAcceptMode from './setBetAcceptMode';

let couponOpenning = false;

export const isCouponOpenning = (): boolean => couponOpenning;

const jsFail = (message = ''): void => {
  if (message) {
    log(message, 'red');
  }
  couponOpenning = false;
  worker.JSFail();
};

const showStake = async (): Promise<void> => {
  couponOpenning = true;

  await awaiter(appLoaded);
  if (!appLoaded()) {
    jsFail('API не загрузилось');
    return;
  }

  await authCheckReady();
  worker.Islogin = checkAuth();
  worker.JSLogined();
  if (!worker.Islogin) {
    jsFail('Нет авторизации');
    return;
  }
  if (checkAccountBlocked()) {
    accountBlocked();
    jsFail();
    return;
  }
  processCookieModalWindow();

  await balanceReady();
  updateBalance();

  if (app.accountManager.needVerification()) {
    log('Необходима верификация', 'orange');
  }

  const couponCleared = await clearCoupon();
  if (!couponCleared) {
    worker.JSFail();
    return;
  }

  const factor = Number(worker.BetId);
  if (Number.isNaN(factor)) {
    jsFail(
      `Некорректные мета-данные по ставке. Сообщите в ТП id вилки: "${worker.ForkId}"`
    );
    return;
  }

  // eslint-disable-next-line no-underscore-dangle
  const evnt = app.lineManager._eventDict[Number(worker.EventId)];
  if (!evnt) {
    jsFail('Событие не найдено');
    return;
  }

  // eslint-disable-next-line no-underscore-dangle
  const line = evnt._factors._factors[factor];
  if (!line) {
    jsFail('Линия не найдена');
    return;
  }

  app.couponManager.newCoupon.newAddStake(
    'live',
    'live',
    evnt.rootId,
    evnt.id,
    line.id,
    line.p
  );

  const betAdded = await awaiter(() => getStakeCount() === 1);
  if (!betAdded) {
    jsFail('Ставка не попала в купон');
    return;
  }

  const minLoaded = await getElement(
    '._min-max--3iR23 .info-block__value--3QhCK:nth-child(1)'
  );
  if (!minLoaded) {
    jsFail('Минимум не появился');
    return;
  }

  log('Купон открыт', 'steelblue');
  if (!checkBet(true)) {
    jsFail('Ставка не соответствует росписи');
    return;
  }
  setBetAcceptMode();
  log('Ставка успешно открыта', 'green');
  couponOpenning = false;
  worker.JSStop();
};

export default showStake;
