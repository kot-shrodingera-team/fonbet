const getSumFromCoupon = (): number => {
  let newCoupon;
  try {
    newCoupon = app.couponManager.newCoupon;
  } catch (e) {
    return -1;
  }
  return newCoupon.amount;
};

export default getSumFromCoupon;
