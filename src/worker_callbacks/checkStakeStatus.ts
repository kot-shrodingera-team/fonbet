import { log } from '@kot-shrodingera-team/germes-utils';
import { setMinimumStake } from '../stake_info/getMinimumStake';
import { setMaximumStake } from '../stake_info/getMaximumStake';
import { updateBalance } from '../stake_info/getBalance';
import { accountBlocked } from '../initialization/accountChecks';

const checkStakeStatus = (): boolean => {
  // eslint-disable-next-line no-underscore-dangle
  const { state } = app.couponManager._list[0];
  if (state === 'register') {
    log('Ставка принята', 'green');
    updateBalance();
    return true;
  }

  const errorSpan = document.querySelector(
    '.error-box--3tiP1 .text-area--2GSj9'
  );
  if (errorSpan) {
    const errorText = errorSpan.textContent.trim();
    // Превышена cуммарная ставка для события "LIVE 1:0 Островская Н - Михайлик Яна Поб 1"|Max=300 руб
    const maxRegex = /\|Max=([\d\s]+)/i;
    const maxRegexMatch = errorText.match(maxRegex);
    const minMaxRegex = /Допустимая сумма ставки ([\d\s]+) - ([\d\s]+)/i;
    const minMaxRegexMatch = errorText.match(minMaxRegex);
    if (maxRegexMatch) {
      const newMax = Number(maxRegexMatch[1].replace(/\s/g, ''));
      setMaximumStake(newMax);
      log(`Ставка не принята (новый макс: ${newMax})`, 'tomato');
    } else if (minMaxRegexMatch) {
      const newMin = Number(maxRegexMatch[1].replace(/\s/g, ''));
      const newMax = Number(maxRegexMatch[2].replace(/\s/g, ''));
      setMinimumStake(newMin);
      setMaximumStake(newMax);
      log(`Ставка не принята (новые лимиты: ${newMin} - ${newMax})`, 'tomato');
    } else if (/Нет прав на выполнение операции/i.test(errorText)) {
      accountBlocked();
      log(`Ставка не принята (Нет прав на выполнение операции)`, 'tomato');
    } else if (/Изменена котировка на событие/i.test(errorText)) {
      log('Ставка не принята (изменена котировка)', 'tomato');
    } else {
      log(`Ставка не принята (${errorText})`, 'tomato');
    }
    const errorOkButton = document.querySelector(
      '.error-box--3tiP1 .button--54u30'
    ) as HTMLElement;
    if (!errorOkButton) {
      log('Не найдена кнопка закрытия ошибки принятия ставки', 'crimson');
    } else {
      errorOkButton.click();
      log('Закрыли ошибку принятия ставки', 'orange');
    }
  } else {
    log('Ставка не принята (текст ошибки не найден)', 'crimson');
  }

  return false;
};

export default checkStakeStatus;
