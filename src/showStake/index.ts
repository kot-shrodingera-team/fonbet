/* eslint-disable no-underscore-dangle */
import { awaiter } from '@kot-shrodingera-team/config/util';
import processCookieModalWinow from '../processCookieModalWinow';
import accountBlocked from '../accountChecks';
import checkBet from '../checkBet';
import checkLogin from '../stakeInfo/checkLogin';
import getStakeCount from '../stakeInfo/getStakeCount';
import updateBalance from '../stakeInfo/updateBalance';
import getMinimumStake from '../stakeInfo/getMinimumStake';

const checkLineLoaded = (): boolean => {
  if (app && app.lineManager && app.lineManager._loaded === true) {
    console.log('Линия загрузилась');
    return true;
  }
  console.log('Линия не загрузилась');
  return false;
};

const checkBlockedMirror = (): void => {
  try {
    if (
      (window.document.body
        .children[0] as HTMLElement).innerText.toLowerCase() ===
      '403 - forbidden'
    ) {
      if (!window.stakeData.badMirrorSendMessage) {
        worker.Helper.SendInformedMessage(
          'На фонбете необходимо сменить зеркало'
        );
        window.stakeData.badMirrorSendMessage = true;
      }
    } else {
      window.stakeData.badMirrorSendMessage = false;
    }
  } catch (e) {
    //
  }
};

const getLine = (eventId: number, factors: number[]): FonbetLine => {
  const event = app.lineManager._eventDict[eventId];
  const targetFactor = factors.find(
    (factor) => factor in event._factors._factors
  );
  return event._factors._factors[targetFactor];
};

const showStake = async (): Promise<void> => {
  if (
    worker.GetSessionData &&
    worker.GetSessionData('Fonbet Blocked') === '1'
  ) {
    if (worker.SetBookmakerPaused && worker.SetBookmakerPaused(true)) {
      worker.Helper.WriteLine('Фонбет поставлен на паузу');
      worker.Helper.SendInformedMessage('Фонбет поставлен на паузу');
    }
    worker.Helper.WriteLine('Аккаунт заблокирован');
    worker.JSFail();
    return;
  }

  window.stakeData.currentCoupon = null;

  const isLoadLine = await awaiter(checkLineLoaded);
  if (!isLoadLine) {
    checkBlockedMirror();
    worker.Helper.WriteLine('Линия так и не загрузилась');
    worker.Islogin = false;
    worker.JSLogined();
    return;
  }

  processCookieModalWinow();

  worker.Islogin = checkLogin();
  worker.JSLogined();
  if (!worker.Islogin) {
    worker.Helper.WriteLine('Ошибка открытия купона: Нет авторизации');
    return;
  }

  await awaiter(() => {
    if (app && app.session && app.session.attributes) {
      return typeof app.session.attributes.liveBlocked !== 'undefined';
    }
    return false;
  });

  if (!window.devStuff.dontCheckBlocked && app.session.attributes.liveBlocked) {
    accountBlocked();
    worker.JSFail();
    return;
  }

  if (app.accountManager.needVerification()) {
    worker.Helper.WriteLine('Необходима верификация');
  }

  if (getStakeCount() !== 0) {
    worker.Helper.WriteLine('Купон не пуст. Чистим');
    app.couponManager.newCoupon.clear();
    const couponCleared = await awaiter(() => {
      return getStakeCount() === 0;
    });
    if (!couponCleared) {
      worker.Helper.WriteLine(
        'Ошибка открытия купона: Не удалось очистить купон'
      );
      worker.JSFail();
      return;
    }
    worker.Helper.WriteLine('Очистили купон');
  }

  updateBalance();

  const evnt = app.lineManager._eventDict[Number(worker.EventId)];
  if (!evnt) {
    worker.Helper.WriteLine('Событие не найдено');
    worker.JSFail();
    return;
  }

  const factors = [];
  if (worker.BetId.indexOf('_') !== -1) {
    factors.push(Number(worker.BetId.split('_')[1]));
  } else {
    factors.push(Number(worker.BetId));
  }

  const line = getLine(Number(worker.EventId), factors);
  console.dir(line);
  console.dir(evnt);
  if (!line) {
    worker.Helper.WriteLine('Линия не найдена');
    worker.JSFail();
    return;
  }

  // if (window.app.couponManager.newCoupon.addStake) {
  //   window.app.couponManager.newCoupon.addStake(
  //     evnt.convertToSmallDefinition(),
  //     line
  //   );
  // }

  // if (window.app.couponManager.newCoupon.newAddStake) {
  app.couponManager.newCoupon.newAddStake(
    'live',
    'live',
    evnt.rootId,
    evnt.id,
    line.id,
    line.p
  );
  // }

  const stakeOpened = await awaiter(() => getStakeCount() === 1);
  if (!stakeOpened) {
    worker.Helper.WriteLine(
      'Ошибка открытия купона: Ставка не появилась в купоне'
    );
    worker.JSFail();
    return;
  }

  const minLoaded = await awaiter(() => !Number.isNaN(getMinimumStake()));
  if (!minLoaded) {
    worker.Helper.WriteLine('Ошибка открытия купона: Минимум не появился');
    worker.JSFail();
    return;
  }
  if (!checkBet(true)) {
    worker.Helper.WriteLine('Ставка не соответствует росписи');
    worker.JSFail();
    return;
  }
  worker.Helper.WriteLine('Ставка соответствует росписи');
  worker.Helper.WriteLine('Ставка успешно открылась');
  worker.JSStop();
};

export default showStake;
