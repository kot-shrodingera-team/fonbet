const getCoefficientFromCoupon = (): number => {
  let stake;
  try {
    [stake] = app.couponManager.newCoupon.stakes;
  } catch (e) {
    return 0;
  }
  const coefficient = stake.v;
  const newCoefficient = stake.vNew;
  if (newCoefficient) {
    return newCoefficient;
  }
  return coefficient;
};

export default getCoefficientFromCoupon;
