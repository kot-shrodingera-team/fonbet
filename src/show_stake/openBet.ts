import { awaiter, getElement, log } from '@kot-shrodingera-team/germes-utils';
import { minimumStakeReady } from '../stake_info/getMinimumStake';
import getStakeCount from '../stake_info/getStakeCount';
import JsFailError from './errors/jsFailError';
import setBetAcceptMode from './setBetAcceptMode';

const openBet = async (): Promise<void> => {
  const factor = Number(worker.BetId);
  if (Number.isNaN(factor)) {
    throw new JsFailError(
      `Некорректные мета-данные по ставке. Сообщите в ТП id вилки: "${worker.ForkId}"`
    );
  }

  const evnt = await awaiter(
    () => app.lineManager.findEvent(Number(worker.EventId)),
    5000,
    100
  );
  if (!evnt) {
    throw new JsFailError('Событие не найдено');
  }

  // eslint-disable-next-line no-underscore-dangle
  const line = evnt._factors._factors[factor];
  if (!line) {
    throw new JsFailError('Линия не найдена');
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
    throw new JsFailError('Ставка не попала в купон');
  }
  log('Ставка попала в купон', 'steelblue');

  const minLoaded = await minimumStakeReady();
  if (!minLoaded) {
    throw new JsFailError('Минимум не появился');
  }
  log('Появился минимум', 'steelblue');

  setBetAcceptMode();
};

export default openBet;
