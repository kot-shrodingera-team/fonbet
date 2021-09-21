import checkCouponLoadingGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/checkCouponLoading';
import {
  log,
  getElement,
  awaiter,
  getRemainingTimeout,
  checkCouponLoadingError,
  checkCouponLoadingSuccess,
  text,
  sendTGBotMessage,
} from '@kot-shrodingera-team/germes-utils';
import { StateMachine } from '@kot-shrodingera-team/germes-utils/stateMachine';
import { accountBlocked } from '../helpers/accountChecks';
import checkLastCoupons from '../helpers/checkLastCoupons';

// const secondsOverlaySelector = '[class*="seconds-overlay"]';
// const loaderSelector = '';
const errorSelector = '[class*="error-box"] [class*="text-area"]';
const emptyCouponSelector = '[class*="new-coupon"] > [class*="empty"]';

const closeError = () => {
  const errorOkButton = document.querySelector<HTMLElement>(
    '[class*="error-box--"] > [class*="button-area--"] > [class*="button--"]'
  );
  if (!errorOkButton) {
    log('Не найдена кнопка закрытия ошибки принятия ставки', 'crimson');
  } else {
    log('Нажимаем на кнопку закрытия ошибки принятия ставки', 'orange');
    errorOkButton.click();
  }
};

const asyncCheck = async () => {
  const machine = new StateMachine();

  machine.promises = {
    error: () => getElement(errorSelector, getRemainingTimeout()),
    betPlaced: awaiter(() => checkLastCoupons(), getRemainingTimeout(), 100),
  };

  machine.setStates({
    start: {
      entry: async () => {
        log('Начало обработки ставки', 'steelblue');
        log(
          `Ждём принятия ставки ${window.germesData.currentBet.eventName} - ${window.germesData.currentBet.betName}`,
          'steelblue'
        );
        getElement(emptyCouponSelector, getRemainingTimeout()).then(
          (emptyCoupon) => {
            if (emptyCoupon) {
              log('Купон очистился', 'steelblue');
            }
          }
        );
      },
    },
    // loader: {
    //   entry: async () => {
    //     log('Появился индикатор', 'steelblue');
    //     window.germesData.betProcessingAdditionalInfo = 'индикатор';
    //     delete machine.promises.loader;
    //     machine.promises.loaderDissappeared = () =>
    //       awaiter(
    //         () => document.querySelector(loaderSelector) === null,
    //         getRemainingTimeout()
    //       );
    //   },
    // },
    // loaderDissappeared: {
    //   entry: async () => {
    //     log('Исчез индикатор', 'steelblue');
    //     window.germesData.betProcessingAdditionalInfo = null;
    //     delete machine.promises.loaderDissappeared;
    //   },
    // },
    error: {
      entry: async () => {
        log('Появилась ошибка', 'steelblue');
        window.germesData.betProcessingAdditionalInfo = null;
        const errorText = text(machine.data.result as HTMLElement);
        log(errorText, 'tomato');

        // Превышена cуммарная ставка для события "LIVE 1:0 Островская Н - Михайлик Яна Поб 1"|Max=300 руб
        // Могут быть пробелы, например если валюта тенге |Max=1 000 тенге
        const maxRegex = /\|Max=([\d\s]+)/i;
        const maxRegexMatch = errorText.match(maxRegex);
        if (maxRegexMatch) {
          const newMax = Number(maxRegexMatch[1].replace(/\s/g, ''));
          window.germesData.maximumStake = newMax;
          closeError();
          checkCouponLoadingError({
            botMessage: `Новый макс: ${newMax}`,
          });
          machine.end = true;
          return;
        }

        const minMaxRegex = /Допустимая сумма ставки ([\d\s]+) - ([\d\s]+)/i;
        const minMaxRegexMatch = errorText.match(minMaxRegex);
        if (minMaxRegexMatch) {
          const newMin = Number(maxRegexMatch[1].replace(/\s/g, ''));
          const newMax = Number(maxRegexMatch[2].replace(/\s/g, ''));
          window.germesData.minimumStake = newMin;
          window.germesData.maximumStake = newMax;
          closeError();
          checkCouponLoadingError({
            botMessage: `Новые лимиты: ${newMin} - ${newMax}`,
          });
          machine.end = true;
          return;
        }

        if (/Нет прав на выполнение операции/i.test(errorText)) {
          accountBlocked();
          closeError();
          checkCouponLoadingError({});
          machine.end = true;
          return;
        }

        if (/Изменена котировка на событие/i.test(errorText)) {
          closeError();
          checkCouponLoadingError({});
          machine.end = true;
          return;
        }

        worker.Helper.SendInformedMessage(errorText);
        sendTGBotMessage(
          '1786981726:AAE35XkwJRsuReonfh1X2b8E7k9X4vknC_s',
          126302051,
          errorText
        );

        closeError();
        checkCouponLoadingError({});
        machine.end = true;
      },
    },
    betPlaced: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = null;

        if (checkLastCoupons(true)) {
          const lastCouponCaption = document.querySelector(
            '[class*="coupon-list"] article[class*="coupon"] [class*="caption"]'
          );
          if (!lastCouponCaption) {
            log('Не найден заголовок купона', 'crimson');
          } else {
            log(text(lastCouponCaption), 'orange');
          }
        } else {
          // Может такое быть?
        }

        checkCouponLoadingSuccess('Ставка принята');
        machine.end = true;
      },
    },
    timeout: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = null;
        checkCouponLoadingError({
          botMessage: 'Не дождались результата ставки',
          informMessage: 'Не дождались результата ставки',
        });
        machine.end = true;
      },
    },
  });

  machine.start('start');
};

const checkCouponLoading = checkCouponLoadingGenerator({
  asyncCheck,
});

export default checkCouponLoading;
