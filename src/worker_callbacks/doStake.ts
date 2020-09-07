import { log } from '@kot-shrodingera-team/germes-utils';
import doStakeGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/doStake';
import getCoefficient from '../stake_info/getCoefficient';
import { clearDoStakeTime } from '../stake_info/doStakeTime';
import { accountBlocked } from '../initialization/accountChecks';
import { clearErrorResultStartTime } from './checkCouponLoading';

// Можно заинжектить клонирование нового купона в переменную и следить за изменением статуса в нём
// Можно просто смотреть в app.couponManager._list[0].state

// let cloneCouponToPlaceInjected = false;

// const injectCloneCoupon = (): void => {
//   if (!cloneCouponToPlaceInjected) {
//     app.couponManager.newCoupon.cloneCouponToPlace = ((cloneCouponToPlace) => {
//       return function injectedCloneCouponToPlace(
//         ...args: unknown[]
//       ): FonbetCoupon {
//         window.stakeData.currentCoupon = cloneCouponToPlace.apply(
//           this,
//           ...args
//         );
//         return window.stakeData.currentCoupon;
//       };
//     })(app.couponManager.newCoupon.cloneCouponToPlace);
//     cloneCouponToPlaceInjected = true;
//   }
// };

const preCheck = (): boolean => {
  const errorSpan = document.querySelector(
    '.error-box--3tiP1 .text-area--2GSj9'
  );
  if (errorSpan) {
    const errorText = errorSpan.textContent.trim();
    if (errorText === 'Нет прав на выполнение операции') {
      accountBlocked();
      return false;
    }
  }

  const acceptChangesButton = document.querySelector(
    '.button-accept--2SBJ-._enabled--1njsj'
  ) as HTMLElement;
  if (acceptChangesButton) {
    acceptChangesButton.click();
    log('В купоне были изменения. Принимаем', 'orange');
    return false;
  }

  clearDoStakeTime();
  clearErrorResultStartTime();

  return true;
};

const doStake = doStakeGenerator({
  preCheck,
  doStakeButtonSelector: '.button--54u30.normal-bet--3r-PV',
  errorClasses: [
    {
      className: '_disabled--1hdBR',
    },
  ],
  getCoefficient,
  clearDoStakeTime,
});

export default doStake;
