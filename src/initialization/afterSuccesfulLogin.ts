import processCookieModalWindow from './processCookieModalWinow';
import { checkAccountBlocked, accountBlocked } from './accountChecks';

const afterSuccesfulLogin = async (): Promise<void> => {
  processCookieModalWindow();
  if (checkAccountBlocked()) {
    accountBlocked();
  }
};

export default afterSuccesfulLogin;
