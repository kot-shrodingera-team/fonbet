import { log } from '@kot-shrodingera-team/germes-utils';

const afterSuccesfulStake = (): void => {
  const lastStakeCoefficient = document.querySelector(
    '.coupon__table-stake--rkHNN, .coupon__info-text--WpI3L'
  );
  if (!lastStakeCoefficient) {
    log(
      'Ошибка обновления коэффициента после успешной ставки: не найден коеффициент последней ставки',
      'crimson'
    );
    return;
  }
  const resultCoefficientText = lastStakeCoefficient.textContent.trim();
  const resultCoefficient = Number(resultCoefficientText);
  if (Number.isNaN(resultCoefficient)) {
    log(
      `Ошибка обновления коэффициента после успешной ставки: непонятный формат коэффициента: "${resultCoefficientText}"`,
      'crimson'
    );
    return;
  }
  if (resultCoefficient !== worker.StakeInfo.Coef) {
    log(
      `Коеффициент изменился: ${worker.StakeInfo.Coef} => ${resultCoefficient}`,
      'orange'
    );
    worker.StakeInfo.Coef = resultCoefficient;
    return;
  }
  log('Коеффициент не изменился', 'lightblue');
};

export default afterSuccesfulStake;
