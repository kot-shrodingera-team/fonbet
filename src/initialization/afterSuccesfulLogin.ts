import { awaiter, log } from '@kot-shrodingera-team/germes-utils';
import processCookieModalWindow from './processCookieModalWinow';
import { checkAccountBlocked, accountBlocked } from './accountChecks';
import appLoaded from './appLoaded';

const afterSuccesfulLogin = async (): Promise<void> => {
  await awaiter(appLoaded);
  if (!appLoaded()) {
    log('API не загрузилось', 'crimson');
    return;
  }
  processCookieModalWindow();
  if (checkAccountBlocked()) {
    accountBlocked();
  }
};

export default afterSuccesfulLogin;
