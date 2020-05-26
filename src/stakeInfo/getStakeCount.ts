const getStakeCount = (): number => {
  let newCoupon;
  try {
    newCoupon = app.couponManager.newCoupon;
  } catch (e) {
    return 0;
  }
  return newCoupon.stakeCount;
};

export default getStakeCount;
