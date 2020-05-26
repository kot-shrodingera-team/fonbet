import showStake from '../showStake';
import checkBet from '../checkBet';

const checkStakeEnabled = (): boolean => {
  let stake;
  try {
    [stake] = app.couponManager.newCoupon.stakes;
  } catch (e) {
    return false;
  }
  if (!stake) {
    worker.Helper.WriteLine('Нет ставки');
    showStake();
    return false;
  }
  if (!stake.available) {
    worker.Helper.WriteLine('Ставка недоступна');
    return false;
  }
  if (stake.blocked) {
    worker.Helper.WriteLine('Ставка заблокирована');
    return false;
  }
  if (!checkBet()) {
    return false;
  }
  return true;
};

export default checkStakeEnabled;
