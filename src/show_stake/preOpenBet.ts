import { log, getElement } from '@kot-shrodingera-team/germes-utils';
import { JsFailError } from '@kot-shrodingera-team/germes-utils/errors';

const preOpenBet = async (): Promise<void> => {
  const wideCouponButton = document.querySelector<HTMLElement>(
    '[title="Широкая лента купонов"]'
  );
  if (wideCouponButton) {
    log('Включена узкая лента купонов. Переключаем на широкую', 'orange');
    wideCouponButton.click();
    const narrowCouponButton = await getElement(
      '[title="Узкая лента купонов"]'
    );
    if (!narrowCouponButton) {
      throw new JsFailError(
        'Не удалось переключиться на широкую ленту купонов'
      );
    }
    log('Переключились на широкую ленту купонов', 'steelblue');
  } else {
    const narrowCouponButton = await getElement(
      '[title="Узкая лента купонов"]'
    );
    if (!narrowCouponButton) {
      throw new JsFailError('Ошибка определения широкой/узкой ленты купонов');
    }
    log('Выбрана широкая лента купонов', 'steelblue');
  }
};

export default preOpenBet;
