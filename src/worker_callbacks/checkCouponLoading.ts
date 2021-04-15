import checkCouponLoadingGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/checkCouponLoading';
import {
  awaiter,
  checkCouponLoadingError,
  checkCouponLoadingSuccess,
  getElement,
  getRemainingTimeout,
  log,
} from '@kot-shrodingera-team/germes-utils';
import { accountBlocked } from '../show_stake/helpers/accountChecks';

// const secondsOverlaySelector = '[class*="seconds-overlay"]';
const errorSpanSelector = '[class*="error-box"] [class*="text-area"]';
const emptyCouponSelector = '[class*="new-coupon"] > [class*="empty"]';

const checkLastCoupons = (logging = false) => {
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

const closeError = () => {
  const errorOkButton = document.querySelector<HTMLElement>(
    '[class*="error-box"] [class*="button"]'
  );
  if (!errorOkButton) {
    log('Не найдена кнопка закрытия ошибки принятия ставки', 'crimson');
  } else {
    log('Нажимаем на кнопку закрытия ошибки принятия ставки', 'orange');
    errorOkButton.click();
  }
};

const asyncCheck = async () => {
  window.germesData.betProcessingStep = 'waitingForAcceptOrError';

  log(
    `Ждём принятия ставки ${window.germesData.currentBet.eventName} - ${window.germesData.currentBet.betName}`,
    'steelblue'
  );

  getElement(emptyCouponSelector, getRemainingTimeout()).then(() => {
    log('Купон очистился', 'steelblue');
  });

  await Promise.race([
    getElement(errorSpanSelector, getRemainingTimeout()),
    awaiter(() => checkLastCoupons(), getRemainingTimeout(), 100),
  ]);

  const errorSpan = document.querySelector(errorSpanSelector);
  if (errorSpan) {
    const errorSpanText = errorSpan.textContent.trim();
    log(errorSpanText, 'tomato');

    // Превышена cуммарная ставка для события "LIVE 1:0 Островская Н - Михайлик Яна Поб 1"|Max=300 руб
    // Могут быть пробелы, например если валюта тенге |Max=1 000 тенге
    const maxRegex = /\|Max=([\d\s]+)/i;
    const maxRegexMatch = errorSpanText.match(maxRegex);
    if (maxRegexMatch) {
      const newMax = Number(maxRegexMatch[1].replace(/\s/g, ''));
      window.germesData.maximumStake = newMax;
      closeError();
      return checkCouponLoadingError({
        botMessage: `Новый макс: ${newMax}`,
      });
    }

    const minMaxRegex = /Допустимая сумма ставки ([\d\s]+) - ([\d\s]+)/i;
    const minMaxRegexMatch = errorSpanText.match(minMaxRegex);
    if (minMaxRegexMatch) {
      const newMin = Number(maxRegexMatch[1].replace(/\s/g, ''));
      const newMax = Number(maxRegexMatch[2].replace(/\s/g, ''));
      window.germesData.minimumStake = newMin;
      window.germesData.maximumStake = newMax;
      closeError();
      return checkCouponLoadingError({
        botMessage: `Новые лимиты: ${newMin} - ${newMax}`,
      });
    }

    if (/Нет прав на выполнение операции/i.test(errorSpanText)) {
      accountBlocked();
      closeError();
      return checkCouponLoadingError({});
    }

    if (/Изменена котировка на событие/i.test(errorSpanText)) {
      closeError();
      return checkCouponLoadingError({});
    }
    closeError();
    return checkCouponLoadingError({});
  }

  if (checkLastCoupons(true)) {
    const lastCouponCaption = document.querySelector(
      '[class*="coupon-list"] article[class*="coupon"] [class*="caption"]'
    );
    if (!lastCouponCaption) {
      log('Не найден заголовок купона', 'crimson');
    } else {
      log(lastCouponCaption.textContent.trim(), 'orange');
    }

    return checkCouponLoadingSuccess('Ставка принята');
  }

  return checkCouponLoadingError({
    botMessage: 'Не дождались результата ставки',
    informMessage: 'Не дождались результата ставки',
  });
};

const check = () => {
  const step = window.germesData.betProcessingStep;
  const additionalInfo = window.germesData.betProcessingAdditionalInfo
    ? ` (${window.germesData.betProcessingAdditionalInfo})`
    : '';
  switch (step) {
    case 'beforeStart':
      asyncCheck();
      return true;
    case 'error':
    case 'success':
    case 'reopened':
      log(`Обработка ставки завершена${additionalInfo}`, 'orange');
      log(step, 'orange', true);
      return false;
    default:
      log(`Обработка ставки${additionalInfo}`, 'tan');
      log(step, 'tan', true);
      return true;
  }
};

const checkCouponLoading = checkCouponLoadingGenerator({
  check,
});

export default checkCouponLoading;
