import checkStakeEnabledGenerator from '@kot-shrodingera-team/germes-generators/stake_info/checkStakeEnabled';
import {
  accountBlocked,
  checkAccountBlocked,
} from '../initialization/accountChecks';
import getStakeCount from './getStakeCount';

const preCheck = (): boolean => {
  if (checkAccountBlocked()) {
    accountBlocked();
    return false;
  }
  return true;
};

const checkStakeEnabled = checkStakeEnabledGenerator({
  preCheck,
  getStakeCount,
  errorsCheck: [
    {
      selector: '.overlay-unavailable--28rSG',
    },
  ],
});

export default checkStakeEnabled;
