import checkStakeEnabledGenerator from '@kot-shrodingera-team/germes-generators/stake_info/checkStakeEnabled';
import {
  accountBlocked,
  checkAccountBlocked,
} from '../show_stake/helpers/accountChecks';
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
  // betCheck: {
  //   selector: '',
  //   errorClasses: [
  //     {
  //       className: '',
  //       message: '',
  //     },
  //   ],
  // },
  errorsCheck: [
    {
      selector: '[class*="overlay-unavailable"]',
      // message: '',
    },
    {
      selector:
        'tr[class*="stake-wide--"] > td[class*="column2--"][class*="_blocked--"]',
      message: 'заблокирована',
    },
  ],
  // context: () => document,
});

export default checkStakeEnabled;
