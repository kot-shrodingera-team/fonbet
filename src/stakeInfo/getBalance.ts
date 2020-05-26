const getBalance = (): number => {
  if (window.devStuff.fake) {
    return 1000;
  }
  const balanceElement = document.querySelector('.header__login-balance');
  if (!balanceElement) {
    worker.Helper.WriteLine('Не найден баланс');
    return -1;
  }
  const balance = Number(balanceElement.textContent.trim().replace(/ /g, ''));
  if (Number.isNaN(balance)) {
    worker.Helper.WriteLine(
      `Некорректный формат баланса: ${balanceElement.textContent.trim()}`
    );
    return -1;
  }
  return balance;
};

export default getBalance;
