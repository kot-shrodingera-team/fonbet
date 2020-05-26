const getMinimumStake = (): number => {
  if (window.stakeData.isNewMin) {
    // window.stakeData.isNewMin = false;
    return window.stakeData.newMinValue;
  }
  let newCoupon;
  try {
    newCoupon = app.couponManager.newCoupon;
  } catch (e) {
    return -1;
  }
  return newCoupon.amountMin;
};

export default getMinimumStake;
