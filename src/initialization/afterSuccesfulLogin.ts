import { awaiter } from '@kot-shrodingera-team/germes-utils';
import { checkAccountBlocked, accountBlocked } from '../helpers/accountChecks';
import appLoaded from '../helpers/checkAppLoaded';

const afterSuccesfulLogin = async (): Promise<void> => {
  await awaiter(appLoaded);
  if (checkAccountBlocked()) {
    accountBlocked();
  }
};

export default afterSuccesfulLogin;
