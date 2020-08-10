import { log } from '@kot-shrodingera-team/germes-utils';

export const checkAccountBlocked = (): boolean => {
  return app.session.attributes.liveBlocked;
};

export const accountBlocked = (): void => {
  const { payBlocked } = app.session.attributes;
  const message = `Аккаунт Фонбет заблокирован! ${
    payBlocked
      ? 'Вывод заблокирован, требуется верификация'
      : 'Вывод доступен, верификация не требуется'
  }. ${
    worker.SetBookmakerPaused && worker.SetBookmakerPaused(true)
      ? 'Фонбет поставлен на паузу'
      : 'Фонбет НЕ поставлен на паузу'
  }`;
  log(message, 'crimson');
  worker.Helper.SendInformedMessage(message);
  if (worker.SetSessionData) {
    worker.SetSessionData('Fonbet Blocked', '1');
  }
};
