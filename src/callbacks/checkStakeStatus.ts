import accountBlocked from '../accountChecks';
import updateBalance from '../stakeInfo/updateBalance';

/* eslint-disable no-underscore-dangle */
const checkStakeStatus = (): boolean => {
  if (window.devStuff.fake) {
    return true;
  }
  const { currentCoupon } = window.stakeData;
  if (currentCoupon.state === 'register') {
    worker.Helper.WriteLine('Ставка принята');
    updateBalance();
    return true;
  }
  try {
    if (
      currentCoupon.extra.requestId ===
        app.couponManager._list[0].extra.requestId &&
      app.couponManager._list[0].state === 'register'
    ) {
      worker.Helper.WriteLine('Ставка в списке принятых купонов2');
      updateBalance();
      return true;
    }
  } catch (e) {
    //
  }

  const errorSpan = document.querySelector(
    '.error-box--3tiP1 .text-area--2GSj9'
  );
  if (errorSpan) {
    const errorMessage = errorSpan.textContent.trim();
    worker.Helper.WriteLine(`Ошибка принятия купона: "${errorMessage}"`);
    // Превышена cуммарная ставка для события "LIVE 1:0 Островская Н - Михайлик Яна Поб 1"|Max=300 руб
    const maxRegex = /\|Max=([\d ]+)/i;
    const maxRegexMatch = errorMessage.match(maxRegex);
    if (maxRegexMatch) {
      const newMax = Number(maxRegexMatch[1].replace(/ /g, ''));
      window.stakeData.newMaxValue = newMax;
      window.stakeData.isNewMax = true;
      worker.Helper.WriteLine(`Новый максимум: ${newMax}`);
    }
    const minMaxRegex = /Допустимая сумма ставки ([\d ]+) - ([\d ]+)/i;
    const minMaxRegexMatch = errorMessage.match(minMaxRegex);
    if (minMaxRegexMatch) {
      const newMin = Number(maxRegexMatch[1].replace(/ /g, ''));
      const newMax = Number(maxRegexMatch[2].replace(/ /g, ''));
      window.stakeData.newMinValue = newMin;
      window.stakeData.isNewMin = true;
      window.stakeData.newMaxValue = newMax;
      window.stakeData.isNewMax = true;
      worker.Helper.WriteLine(
        `Новые минимум и максимум: ${newMin} - ${newMax}`
      );
    }
    if (errorMessage === 'Нет прав на выполнение операции') {
      accountBlocked();
      return false;
    }
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

  return false;
};

export default checkStakeStatus;
