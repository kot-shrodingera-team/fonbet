import { log } from '@kot-shrodingera-team/germes-utils';
import getStakeInfoGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/getStakeInfo';
import showStake, { isCouponOpenning } from '../show_stake';
import checkAuth from '../stake_info/checkAuth';
import getStakeCount from '../stake_info/getStakeCount';
import getBalance from '../stake_info/getBalance';
import getMinimumStake from '../stake_info/getMinimumStake';
import getMaximumStake from '../stake_info/getMaximumStake';
import getCurrentSum from '../stake_info/getCurrentSum';
import checkStakeEnabled from '../stake_info/checkStakeEnabled';
import getCoefficient from '../stake_info/getCoefficient';
import getParameter from '../stake_info/getParameter';

const preAction = (): boolean => {
  const errorSpan = document.querySelector(
    '.error-box--3tiP1 .text-area--2GSj9'
  );

  if (errorSpan) {
    log(`Висит ошибка: "${errorSpan.textContent.trim()}"`, 'tan');
    const errorOkButton = document.querySelector(
      '.error-box--3tiP1 .button--54u30'
    ) as HTMLElement;
    if (!errorOkButton) {
      log('Не найдена кнопка закрытия', 'crimson');
      return false;
    }
    errorOkButton.click();
    log('Закрыли ошибку', 'orange');
  }

  const acceptChangesButton = document.querySelector(
    '.button-accept--2SBJ-._enabled--1njsj'
  ) as HTMLElement;
  if (acceptChangesButton) {
    acceptChangesButton.click();
    log('В купоне были изменения. Принимаем', 'orange');
    return false;
  }
  return true;
};

const getStakeInfo = getStakeInfoGenerator({
  preAction,
  isCouponOpenning,
  showStake,
  checkAuth,
  getStakeCount,
  getBalance,
  getMinimumStake,
  getMaximumStake,
  getCurrentSum,
  checkStakeEnabled,
  getCoefficient,
  getParameter,
});

export default getStakeInfo;
