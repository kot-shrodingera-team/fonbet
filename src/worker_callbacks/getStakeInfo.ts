import { log } from '@kot-shrodingera-team/germes-utils';
import getStakeInfoGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/getStakeInfo';
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
    '[class*="error-box"] [class*="text-area"]'
  );

  if (errorSpan) {
    const errorText = errorSpan.textContent.trim();
    log(`Висит ошибка: "${errorText}"`, 'crimson');
    const errorOkButton = document.querySelector<HTMLElement>(
      '[class*="error-box--"] > [class*="button-area--"] > [class*="button--"]'
    );
    if (!errorOkButton) {
      log('Не найдена кнопка закрытия ошибки', 'crimson');
      return false;
    }
    errorOkButton.click();
    log('Закрыли ошибку', 'orange');
  }

  const acceptChangesButton = document.querySelector<HTMLElement>(
    '[class*="button-accept"][class*="_enabled"]'
  );
  if (acceptChangesButton) {
    acceptChangesButton.click();
    log('В купоне были изменения. Принимаем', 'orange');
    return false;
  }
  return true;
};

const getStakeInfo = getStakeInfoGenerator({
  preAction,
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
