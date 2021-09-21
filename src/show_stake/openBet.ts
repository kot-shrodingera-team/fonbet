import {
  getWorkerParameter,
  log,
  repeatingOpenBet,
} from '@kot-shrodingera-team/germes-utils';
import { JsFailError } from '@kot-shrodingera-team/germes-utils/errors';
import getMaximumStake from '../stake_info/getMaximumStake';
import { minimumStakeReady } from '../stake_info/getMinimumStake';
import getStakeCount from '../stake_info/getStakeCount';
import clearCoupon from './clearCoupon';

const openBet = async (): Promise<void> => {
  worker.TakeScreenShot(false);
  // Поймать случай, когда определяется, что купон пуст, но это не так
  // В итоге новая стака добавляется в купон, потом убирается, и остаётся только старая

  /* ======================================================================== */
  /*                              Очистка купона                              */
  /* ======================================================================== */

  const couponCleared = await clearCoupon();
  if (!couponCleared) {
    throw new JsFailError('Не удалось очистить купон');
  }

  /* ======================================================================== */
  /*                      Формирование данных для поиска                      */
  /* ======================================================================== */

  const eventRootId = Number(worker.EventId);
  const {
    subevent_id: eventId,
    factor_id: lineId,
    p: lineP,
  } = JSON.parse(worker.BetId);

  /* ======================================================================== */
  /*           Открытие ставки, проверка, что ставка попала в купон           */
  /* ======================================================================== */

  const openingAction = async () => {
    app.couponManager.newCoupon.newAddStake(
      'live',
      'live',
      eventRootId,
      Number(eventId),
      Number(lineId),
      typeof lineP !== 'undefined' ? Number(lineP) * 100 : undefined
    );
  };
  await repeatingOpenBet(openingAction, getStakeCount, 5, 1000, 50);

  /* ======================================================================== */
  /*                        Ожидание минимальной ставки                       */
  /* ======================================================================== */

  const minLoaded = await minimumStakeReady();
  if (!minLoaded) {
    throw new JsFailError('Минимум не появился');
  }
  log('Появился минимум', 'steelblue');

  /* ======================================================================== */
  /*                    Вывод информации об открытой ставке                   */
  /* ======================================================================== */

  const eventNameSelector = '[class*="stake-wide"] > [class*="column2--"]';
  const betNameSelector = '[class*="stake-wide"] > [class*="column3--"]';

  const eventNameElement = document.querySelector(eventNameSelector);
  const betNameElement = document.querySelector(betNameSelector);

  if (!eventNameElement) {
    throw new JsFailError('Не найдено событие открытой ставки');
  }
  if (!betNameElement) {
    throw new JsFailError('Не найдена роспись открытой ставки');
  }

  const eventName = eventNameElement.textContent.trim();
  const betName = betNameElement.textContent.trim();

  log(`Открыта ставка\n${eventName}\n${betName}`, 'steelblue');

  /* ======================================================================== */
  /*                  Проверка пореза по максимальной ставке                  */
  /* ======================================================================== */

  const accountRestrictionCheckByMaxStake = getWorkerParameter(
    'accountRestrictionCheckByMaxStake'
  );
  if (accountRestrictionCheckByMaxStake) {
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
};

export default openBet;
