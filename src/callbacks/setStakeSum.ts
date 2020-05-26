import { setReactInputValue } from '@kot-shrodingera-team/config/reactUtils';

const setStakeSum = (sum: number): boolean => {
  if (window.devStuff.fake) {
    return true;
  }
  worker.Helper.WriteLine(`Вводим сумму ставки: ${sum}`);
  const sumInput = document.querySelector('input.sum-panel__input--2FGMZ');
  if (!sumInput) {
    worker.Helper.WriteLine('Ошибка ввода суммы: Не найдено поле ввода суммы');
    return false;
  }
  setReactInputValue(sumInput, sum);
  return true;
};

export default setStakeSum;
