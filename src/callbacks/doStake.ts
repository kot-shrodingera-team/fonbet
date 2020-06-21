import accountBlocked from '../accountChecks';
import checkStakeEnabled from '../stakeInfo/checkStakeEnabled';
import getCoefficientFromCoupon from '../stakeInfo/getCoefficientFromCoupon';

let cloneCouponToPlaceInjected = false;

const doStake = (): boolean => {
  if (window.devStuff.fake) {
    return true;
  }

  const errorSpan = document.querySelector(
    '.error-box--3tiP1 .text-area--2GSj9'
  );
  if (
    errorSpan &&
    errorSpan.textContent.trim() === 'Нет прав на выполнение операции'
  ) {
    accountBlocked();
    return false;
  }

  const acceptChangesButton = document.querySelector(
    '.button-accept--2SBJ-._enabled--1njsj'
  ) as HTMLElement;
  if (acceptChangesButton) {
    acceptChangesButton.click();
    worker.Helper.WriteLine('Ставку не сделали, были изменения');
    return false;
  }
  if (!checkStakeEnabled()) {
    worker.Helper.WriteLine('Ставку не сделали, она недоступна');
    return false;
  }
  if (!app.couponManager.newCoupon.stakes[0]) {
    worker.Helper.WriteLine('Ставку не сделали, нет ставок в купоне');
    return false;
  }

  const placeBetButton = window.document.querySelector(
    '.button--54u30.normal-bet--3r-PV'
  ) as HTMLElement;
  if (!placeBetButton) {
    worker.Helper.WriteLine('Не найдена кнопка принятия ставки');
    return false;
  }
  if ([...placeBetButton.classList].includes('_disabled--1hdBR')) {
    worker.Helper.WriteLine('Кнопка принятия ставки недоуступна');
    return false;
  }

  if (!cloneCouponToPlaceInjected) {
    app.couponManager.newCoupon.cloneCouponToPlace = ((cloneCouponToPlace) => {
      return function injectedCloneCouponToPlace(
        ...args: unknown[]
      ): FonbetCoupon {
        window.stakeData.currentCoupon = cloneCouponToPlace.apply(
          this,
          ...args
        );
        return window.stakeData.currentCoupon;
      };
    })(app.couponManager.newCoupon.cloneCouponToPlace);
    cloneCouponToPlaceInjected = true;
  }

  const ceffficient = getCoefficientFromCoupon();
  worker.Helper.WriteLine(`Коэффициент перед ставкой: ${ceffficient}`);
  if (worker.StakeInfo.Coef < ceffficient) {
    worker.Helper.WriteLine('Коэффициент упал');
    return false;
  }

  if (worker.StakeAcceptRuleShoulder === 0) {
    worker.Helper.WriteLine(
      'Устанавливаем режим принятия ставок только с текущим коэффициентом'
    );
    const set = app.headerApi.settings();
    set.takeUpBets = false;
    app.settingsApply(set, 'takeUpBets');
    set.takeChangedBets = false;
    app.settingsApply(set, 'takeChangedBets');
  } else if (worker.StakeAcceptRuleShoulder === 1) {
    worker.Helper.WriteLine(
      'Устанавливаем режим принятия ставок с повышением коэффициента'
    );
    const set = app.headerApi.settings();
    set.takeUpBets = true;
    app.settingsApply(set, 'takeUpBets');
    set.takeChangedBets = false;
    app.settingsApply(set, 'takeChangedBets');
  } else if (worker.StakeAcceptRuleShoulder === 2) {
    worker.Helper.WriteLine(
      'Устанавливаем режим принятия ставок с любым изменением коэффициента'
    );
    const set = app.headerApi.settings();
    set.takeUpBets = true;
    app.settingsApply(set, 'takeUpBets');
    set.takeChangedBets = true;
    app.settingsApply(set, 'takeChangedBets');
  }

  placeBetButton.click();
  worker.Helper.WriteLine('Нажали на Поставить');

  return true;
};

export default doStake;
