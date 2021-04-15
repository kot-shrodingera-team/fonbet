import { awaiter } from '@kot-shrodingera-team/germes-utils';
import {
  checkAccountBlocked,
  accountBlocked,
} from '../show_stake/helpers/accountChecks';
import appLoaded from '../show_stake/helpers/checkAppLoaded';

const afterSuccesfulLogin = async (): Promise<void> => {
  // Сброс флага активности открытия купона, если было какое-то зависание
  localStorage.setItem('couponOpening', '0');

  await awaiter(appLoaded);
  if (checkAccountBlocked()) {
    accountBlocked();
  }
};

export default afterSuccesfulLogin;
