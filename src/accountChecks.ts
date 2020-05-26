const accountBlocked = (): void => {
  const { payBlocked } = app.session.attributes;
  let message = 'Аккаунт Фонбет заблокирован!';
  if (payBlocked) {
    message = `${message} Вывод заблокирован, требуется верификация`;
  } else {
    message = `${message} Вывод доступен, верификация не требуется`;
  }
  if (worker.SetBookmakerPaused && worker.SetBookmakerPaused(true)) {
    message = `${message}. Фонбет поставлен на паузу`;
  } else {
    message = `${message}. Фонбет НЕ поставлен на паузу`;
  }
  worker.Helper.WriteLine(message);
  worker.Helper.SendInformedMessage(message);
  if (worker.SetSessionData) {
    worker.SetSessionData('Fonbet Blocked', '1');
  }
};

export default accountBlocked;
