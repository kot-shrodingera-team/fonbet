import checkCouponLoadingGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/checkCouponLoading';
import { awaiter, getElement, log } from '@kot-shrodingera-team/germes-utils';
import { accountBlocked } from '../initialization/accountChecks';
// import JsFailError from '../show_stake/errors/jsFailError';
// import openBet from '../show_stake/openBet';
import { getDoStakeTime } from '../stake_info/doStakeTime';
import { setMaximumStake } from '../stake_info/getMaximumStake';
import { setMinimumStake } from '../stake_info/getMinimumStake';

const secondsOverlaySelector = '[class*="seconds-overlay"]';
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

const asyncCheck = async () => {
  const error = (message?: string) => {
    if (message !== undefined) {
      log(message, 'crimson');
    }
    window.germesData.betProcessingStep = 'error';
  };
  const success = (message: string) => {
    log(message, 'steelblue');
    window.germesData.betProcessingStep = 'success';
  };
  // const reopen = async (message: string) => {
  //   log(message, 'crimson');
  //   window.germesData.betProcessingStep = 'reopen';
  //   log('Переоткрываем купон', 'orange');
  //   try {
  //     await openBet();
  //     log('Ставка успешно переоткрыта', 'green');
  //     window.germesData.betProcessingStep = 'reopened';
  //   } catch (reopenError) {
  //     if (reopenError instanceof JsFailError) {
  //       log(reopenError.message, 'red');
  //       window.germesData.betProcessingStep = 'error';
  //     }
  //   }
  // };
  const closeError = () => {
    const errorOkButton = document.querySelector(
      '[class*="error-box"] [class*="button"]'
    ) as HTMLElement;
    if (!errorOkButton) {
      log('Не найдена кнопка закрытия ошибки принятия ставки', 'crimson');
    } else {
      log('Нажимаем на кнопку закрытия ошибки принятия ставки', 'orange');
      errorOkButton.click();
    }
  };

  window.germesData.betProcessingStep = 'waitingForAcceptOrError';
  log(
    `Ждём принятия ставки ${window.germesData.currentBet.eventName} - ${window.germesData.currentBet.betName}`,
    'steelblue'
  );

  getElement(emptyCouponSelector, 50000).then(() => {
    log('Купон очистился', 'steelblue');
  });

  await Promise.any<boolean | Element>([
    getElement(errorSpanSelector, 50000),
    awaiter(() => checkLastCoupons(), 50000, 100),
  ]);

  const errorSpan = document.querySelector(errorSpanSelector);
  if (errorSpan) {
    log('Появилась ошибка', 'steelblue');
    const errorSpanText = errorSpan.textContent.trim();
    log(errorSpanText, 'tomato');

    // Превышена cуммарная ставка для события "LIVE 1:0 Островская Н - Михайлик Яна Поб 1"|Max=300 руб
    // Могут быть пробелы, например если валюта тенге |Max=1 000 тенге
    const maxRegex = /\|Max=([\d\s]+)/i;
    const maxRegexMatch = errorSpanText.match(maxRegex);
    if (maxRegexMatch) {
      const newMax = Number(maxRegexMatch[1].replace(/\s/g, ''));
      setMaximumStake(newMax);
      closeError();
      return error(`Новый макс: ${newMax}`);
    }

    const minMaxRegex = /Допустимая сумма ставки ([\d\s]+) - ([\d\s]+)/i;
    const minMaxRegexMatch = errorSpanText.match(minMaxRegex);
    if (minMaxRegexMatch) {
      const newMin = Number(maxRegexMatch[1].replace(/\s/g, ''));
      const newMax = Number(maxRegexMatch[2].replace(/\s/g, ''));
      setMinimumStake(newMin);
      setMaximumStake(newMax);
      closeError();
      return error(`Новые лимиты: ${newMin} - ${newMax}`);
    }

    if (/Нет прав на выполнение операции/i.test(errorSpanText)) {
      accountBlocked();
      closeError();
      return error('Аккаунт заблокирован');
    }

    if (/Изменена котировка на событие/i.test(errorSpanText)) {
      closeError();
      return error('Изменена котировка');
    }
    closeError();
    return error();
  }

  if (!checkLastCoupons(true)) {
    return error();
  }

  const lastCouponCaption = document.querySelector(
    '[class*="coupon-list"] article[class*="coupon"] [class*="caption"]'
  );
  if (!lastCouponCaption) {
    log('Не найден заголовок купона', 'crimson');
  } else {
    log(lastCouponCaption.textContent.trim(), 'orange');
  }

  return success('Ставка принята');
};

const check = () => {
  const step = window.germesData.betProcessingStep;
  const secondsOverlay = document.querySelector(secondsOverlaySelector);
  const seconds = secondsOverlay ? secondsOverlay.textContent.trim() : null;
  const seccondsText = seconds ? ` (${seconds})` : '';
  switch (step) {
    case 'beforeStart':
      asyncCheck();
      return true;
    case 'error':
    case 'success':
    case 'reopened':
      log(`Обработка ставки завершена (${step})`, 'orange');
      return false;
    default:
      log(`Обработка ставки (${step})${seccondsText}`, 'tan');
      return true;
  }
};

const checkCouponLoading = checkCouponLoadingGenerator({
  getDoStakeTime,
  bookmakerName: 'Fonbet',
  timeout: 50000,
  check,
});

export default checkCouponLoading;
