import checkCouponLoadingGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/checkCouponLoading';
import { log } from '@kot-shrodingera-team/germes-utils';
import { getDoStakeTime } from '../stake_info/doStakeTime';

let errorResultStartTime: Date = null;

export const clearErrorResultStartTime = (): void => {
  errorResultStartTime = null;
};

const check = (): boolean => {
  // eslint-disable-next-line no-underscore-dangle
  const { state } = app.couponManager._list[0];
  if (state === 'register') {
    log('Обработка ставки завершена (register)', 'orange');
    return false;
  }
  if (state === 'progress') {
    const secondsOverlay = document.querySelector('.seconds-overlay--1b4JN');
    if (secondsOverlay) {
      const seconds = secondsOverlay.textContent.trim();
      log(`Обработка ставки (progress) (${seconds})`, 'tan');
    } else {
      log('Обработка ставки (progress)', 'tan');
    }
    return true;
  }
  if (state === 'error') {
    if (!errorResultStartTime) {
      errorResultStartTime = new Date();
    } else {
      const now = new Date().getTime();
      const timePassedSinceErrorResult = now - errorResultStartTime.getTime();
      if (timePassedSinceErrorResult > 5000) {
        log(
          `Обработка ставки завершена (состояние error более 5 секунд)`,
          'orange'
        );
        log(
          `${now} - ${errorResultStartTime.getTime()} = ${timePassedSinceErrorResult} > 5000`,
          'orange'
        );
        return false;
      }
    }
  }
  const errorSpan = document.querySelector(
    '.error-box--3tiP1 .text-area--2GSj9'
  );
  if (!errorSpan) {
    log(`Обработка ставки (${state}, но сообщения нет)`, 'tan');
    return true;
  }
  log(`Обработка ставки завершена (${state}, сообщение есть)`, 'orange');
  return false;
};

const checkCouponLoading = checkCouponLoadingGenerator({
  bookmakerName: 'Fonbet',
  getDoStakeTime,
  check,
});

export default checkCouponLoading;
