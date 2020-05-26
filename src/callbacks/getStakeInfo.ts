import showStake from '../showStake';
import checkLogin from '../stakeInfo/checkLogin';
import getStakeCount from '../stakeInfo/getStakeCount';
import checkStakeEnabled from '../stakeInfo/checkStakeEnabled';
import getCoefficientFromCoupon from '../stakeInfo/getCoefficientFromCoupon';
import getBalance from '../stakeInfo/getBalance';
import getMinimumStake from '../stakeInfo/getMinimumStake';
import getMaximumStake from '../stakeInfo/getMaximumStake';
import getSumFromCoupon from '../stakeInfo/getSummFromCoupon';
import getParameterFromCoupon from '../stakeInfo/getParameterFromCoupon';

const getStakeInfo = (): string => {
  // const errorSpan = document.querySelector(
  //   'span[class*="coupon__error-text-area"]'
  // );
  const errorSpan = document.querySelector(
    '.error-box--3tiP1 .text-area--2GSj9'
  );

  if (errorSpan) {
    worker.Helper.WriteLine(
      `Ошибка принятия ставки: "${errorSpan.textContent.trim()}"`
    );
    // const errorButton = document.querySelector(
    //   'a[class*="coupon__error-button"]'
    // ) as HTMLElement;
    const errorOkButton = document.querySelector(
      '.error-box--3tiP1 .button--54u30'
    ) as HTMLElement;
    if (!errorOkButton) {
      worker.Helper.WriteLine(
        'Не найдена кнопка закрытия ошибки принятия ставки'
      );
    } else {
      errorOkButton.click();
      worker.Helper.WriteLine('Закрыли ошибку принятия ставки');
    }
  }

  worker.StakeInfo.Auth = checkLogin();
  worker.StakeInfo.StakeCount = getStakeCount();
  worker.StakeInfo.IsEnebled = checkStakeEnabled();
  worker.StakeInfo.Coef = getCoefficientFromCoupon();
  worker.StakeInfo.Balance = getBalance();
  worker.StakeInfo.MinSumm = getMinimumStake();
  worker.StakeInfo.MaxSumm = getMaximumStake();
  worker.StakeInfo.Summ = getSumFromCoupon();
  worker.StakeInfo.Parametr = getParameterFromCoupon();
  if (getStakeCount() !== 1) {
    showStake();
  }
  return JSON.stringify(worker.StakeInfo);
};

export default getStakeInfo;
