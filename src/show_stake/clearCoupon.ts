import clearCouponGenerator from '@kot-shrodingera-team/germes-generators/show_stake/clearCoupon';
import getStakeCount from '../stake_info/getStakeCount';
// import getMaximumStake from '../stake_info/getMaximumStake';

// const preCheck = (): boolean => {
//   return false;
// };

const apiClear = (): void => {
  app.couponManager.newCoupon.clear();
};

const clearCoupon = clearCouponGenerator({
  // preCheck,
  getStakeCount,
  apiClear,
  clearAllSelector: '',
  clearSingleSelector: '',
  clearMode: 'all-only',
  // maxUnload: {
  //   getMaximumStake,
  // },
});

export default clearCoupon;
