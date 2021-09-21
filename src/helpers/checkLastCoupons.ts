import { log } from '@kot-shrodingera-team/germes-utils';

const checkLastCoupons = (logging = false): boolean => {
  const lastCoupons = [
    ...document.querySelectorAll(
      '[class*="coupon-list"] article[class*="coupon"]'
    ),
  ];
  if (lastCoupons.length === 0) {
    return false;
  }
  let lastFittingCouponsCount = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const coupon of lastCoupons) {
    const eventNameElement = coupon.querySelector(
      'td[class*="coupon__table-col"]:first-child > [class*="coupon__event-link"], td[class*="coupon__table-col"]:first-child > span:last-child'
    );
    if (!eventNameElement) {
      log(
        `Не найден Event Name для купона #${lastFittingCouponsCount + 1}`,
        'crimson'
      );
      return false;
    }
    const betNameElement = coupon.querySelector('td[class*="_type_stake"]');
    if (!betNameElement) {
      log(
        `Не найден Bet Name для купона #${lastFittingCouponsCount + 1}`,
        'crimson'
      );
      return false;
    }
    const eventName = eventNameElement.textContent.trim();
    const betName = betNameElement.textContent.trim();
    if (
      eventName === window.germesData.currentBet.eventName &&
      betName === window.germesData.currentBet.betName
    ) {
      lastFittingCouponsCount += 1;
      if (
        lastFittingCouponsCount ===
        window.germesData.currentBet.lastSameBetCount + 1
      ) {
        return true;
      }
    } else {
      if (logging) {
        log(
          `${eventName} !== ${window.germesData.currentBet.eventName}`,
          'steelblue'
        );
        log(
          `${betName} !== ${window.germesData.currentBet.betName}`,
          'steelblue'
        );
      }
      break;
    }
  }
  if (logging) {
    log(
      `lastFittingCouponsCount = ${lastFittingCouponsCount}\nlastSameBetCount = ${window.germesData.currentBet.lastSameBetCount}`,
      'crimson'
    );
  }
  return false;
};

export default checkLastCoupons;
