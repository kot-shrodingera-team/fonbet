import { awaiter } from '@kot-shrodingera-team/germes-utils';
import { checkAccountBlocked, accountBlocked } from '../helpers/accountChecks';
import appLoaded from '../helpers/checkAppLoaded';

const afterSuccesfulLogin = async (): Promise<void> => {
  // Сброс флага активности открытия купона, если было какое-то зависание
  localStorage.setItem('couponOpening', '0');

  await awaiter(appLoaded);
  if (checkAccountBlocked()) {
    accountBlocked();
  }
};

export default afterSuccesfulLogin;
