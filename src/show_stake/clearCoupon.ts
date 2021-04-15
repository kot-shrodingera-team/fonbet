import clearCouponGenerator from '@kot-shrodingera-team/germes-generators/show_stake/clearCoupon';
import getStakeCount from '../stake_info/getStakeCount';
// import getMaximumStake from '../stake_info/getMaximumStake';

// const preCheck = (): boolean => {
//   return false;
// };

const apiClear = (): void => {
  app.couponManager.newCoupon.clear();
};

// const postCheck = async (): Promise<boolean> => {
//   return true;
// };

const clearCoupon = clearCouponGenerator({
  // preCheck,
  getStakeCount,
  apiClear,
  // clearAllSelector: '',
  // clearSingleSelector: '',
  // postCheck,
  // context: () => document,
});

export default clearCoupon;
