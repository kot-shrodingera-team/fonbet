import {
  awaiter,
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
  const couponCleared = await clearCoupon();
  if (!couponCleared) {
    throw new JsFailError('Не удалось очистить купон');
  }

  // Получение данных из меты
  const factor = Number(worker.BetId);
  if (Number.isNaN(factor)) {
    throw new JsFailError(
      `Некорректные мета-данные по ставке. Сообщите FID (${worker.ForkId}) в ТП`
    );
  }

  // Формирование данных для поиска
  const eventData = await awaiter(
    () => app.lineManager.findEvent(Number(worker.EventId)),
    5000,
    100
  );
  if (!eventData) {
    throw new JsFailError('Не найдена информация о событии');
  }

  // eslint-disable-next-line no-underscore-dangle
  // const lineData = eventData._factors._factors[factor];

  /* eslint-disable no-underscore-dangle */
  const lineData = await awaiter(() => {
    if (
      !eventData._factors ||
      !eventData._factors._factors ||
      !eventData._factors._factors[factor]
    ) {
      return null;
    }
    return eventData._factors._factors[factor];
  });
  /* eslint-enable no-underscore-dangle */
  if (!lineData) {
    throw new JsFailError('Не найдена информация о линии');
  }

  // Открытие ставки, проверка, что ставка попала в купон
  const openingAction = async () => {
    app.couponManager.newCoupon.newAddStake(
      'live',
      'live',
      eventData.rootId,
      eventData.id,
      lineData.id,
      lineData.p
    );
  };
  await repeatingOpenBet(openingAction, getStakeCount, 5, 1000, 50);

  const minLoaded = await minimumStakeReady();
  if (!minLoaded) {
    throw new JsFailError('Минимум не появился');
  }
  log('Появился минимум', 'steelblue');

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
