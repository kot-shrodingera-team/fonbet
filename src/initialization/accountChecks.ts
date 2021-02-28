import { getWorkerParameter, log } from '@kot-shrodingera-team/germes-utils';

export const checkAccountBlocked = (): boolean => {
  if (getWorkerParameter('dontCheckBlocked') === true) {
    return false;
  }
  if (worker.GetSessionData('FonbetCheck') === 'false') {
    return false;
  }
  return app.session.attributes.liveBlocked;
};

export const accountBlocked = (): void => {
  if (getWorkerParameter('dontCheckBlocked') === true) {
    return;
  }
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
