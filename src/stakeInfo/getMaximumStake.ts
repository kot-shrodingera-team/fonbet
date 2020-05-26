const getMaximumStake = (): number => {
  if (window.stakeData.isNewMax) {
    // window.stakeData.isNewMax = false;
    return window.stakeData.newMaxValue;
  }
  let newCoupon;
  try {
    newCoupon = app.couponManager.newCoupon;
  } catch (e) {
    return -1;
  }
  return newCoupon.amountMax;
};

export default getMaximumStake;
