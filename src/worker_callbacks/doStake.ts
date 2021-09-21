import { log } from '@kot-shrodingera-team/germes-utils';
import doStakeGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/doStake';
import getCoefficient from '../stake_info/getCoefficient';
import { accountBlocked } from '../helpers/accountChecks';

const preCheck = (): boolean => {
  const errorSpan = document.querySelector(
    '[class*="error-box"] [class*="text-area"]'
  );
  if (errorSpan) {
    const errorText = errorSpan.textContent.trim();
    if (errorText === 'Нет прав на выполнение операции') {
      accountBlocked();
      return false;
    }
  }

  const acceptChangesButton = document.querySelector<HTMLElement>(
    '[class*="button-accept"][class*="_enabled"]'
  );
  if (acceptChangesButton) {
    acceptChangesButton.click();
    log('В купоне были изменения. Принимаем', 'orange');
    return false;
  }

  // В заголовке купона может быть ID и время ставки, а может быть и текст "Пари не принято"
  // С последним вариантом могут быть проблемы, в частности, если уже был не принятый купон, и новый тоже не принимается
  // То есть текст не поменяется, соответственно просто по изменению заголовка купона нельзя судить о принятии купона
  // Один из вариантов - смотреть, если последние n купонов "Пари не принято", то запоминать их количество и от этого уже плясать

  const currentBet = document.querySelector(
    '[class*="stake-wide"], [class*="stake-narrow"]'
  );
  if (!currentBet) {
    log('Не найжена текущая ставка', 'crimson');
    return false;
  }
  const currentBetColumn2 = currentBet.querySelector('[class*="column2"]');
  if (!currentBetColumn2) {
    log(
      'Не найдена вторая колонка текущей ставки (название события)',
      'crimson'
    );
    return false;
  }
  window.germesData.currentBet.eventName = (() => {
    const wholeEventName = currentBetColumn2.textContent.trim();
    const betScore = currentBetColumn2.querySelector('[class*="bet-score"]');
    if (!betScore) {
      return wholeEventName;
    }
    return wholeEventName.replace(betScore.textContent.trim(), '').trim();
  })();
  const currentBetColumn3 = currentBet.querySelector('[class*="column3"]');
  if (!currentBetColumn3) {
    log('Не найдена третья колонка текущей ставки (исход)', 'crimson');
    return false;
  }
  window.germesData.currentBet.betName = currentBetColumn3.textContent.trim();

  const lastCoupons = [
    ...document.querySelectorAll(
      '[class*="coupon-list"] article[class*="coupon"]'
    ),
  ];
  if (lastCoupons.length !== 0) {
    const lastOtherCoupon = lastCoupons.find((coupon) => {
      const eventNameElement = coupon.querySelector(
        'td[class*="coupon__table-col"]:first-child > [class*="coupon__event-link"], td[class*="coupon__table-col"]:first-child > span:last-child'
      );
      const betNameElement = coupon.querySelector('td[class*="_type_stake"]');
      if (!eventNameElement || !betNameElement) {
        return false;
      }
      return (
        eventNameElement.textContent.trim() !==
          window.germesData.currentBet.eventName ||
        betNameElement.textContent.trim() !==
          window.germesData.currentBet.betName
      );
    });
    const lastOtherBetIndex = lastCoupons.indexOf(lastOtherCoupon);
    window.germesData.currentBet.lastSameBetCount =
      lastOtherBetIndex === -1 ? lastCoupons.length : lastOtherBetIndex;
    if (window.germesData.currentBet.lastSameBetCount > 0) {
      log(
        `Количество таких же последних купонов: ${window.germesData.currentBet.lastSameBetCount}`,
        'steelblue'
      );
    }
  } else {
    window.germesData.currentBet.lastSameBetCount = 0;
  }

  return true;
};

// const postCheck = (): boolean => {
//   return true;
// };

const doStake = doStakeGenerator({
  preCheck,
  doStakeButtonSelector: '[class*="button"][class*="normal-bet"]',
  errorClasses: [
    {
      className: '_disabled--1hdBR',
      // message: '',
    },
  ],
  // disabledCheck: false,
  getCoefficient,
  // postCheck,
  // context: () => document,
});

export default doStake;
