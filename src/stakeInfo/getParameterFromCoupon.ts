const getParameterFromCoupon = (): number => {
  let stake;
  try {
    [stake] = app.couponManager.newCoupon.stakes;
  } catch (e) {
    return 0;
  }
  const parameter = Number(stake.pt);
  const newParameter = Number(stake.ptNew);
  if (parameter) {
    if (newParameter) {
      return newParameter;
    }
    return parameter;
  }
  // Фиксим корявый фон, который не понимает, что эти исходы это Over/Under (0.5)

  // 1 забьёт
  // 4235 - да
  // 4236 - нет

  // 2 забьёт
  // 4238 - да
  // 4239 - нет

  // Обе забьют
  // 4239 - да
  // 4242 - нет

  // Никто не забьёт
  // 4253 - да
  // 4254 - нет

  // Так что явно возвращаем 0.5
  if (
    [4235, 4236, 4238, 4239, 4239, 4242, 4253, 4254].includes(
      app.couponManager.newCoupon.stakes[0].factorId
    )
  ) {
    return 0.5;
  }

  const { stakeName } = app.couponManager.newCoupon.stakes[0];
  const scoreRegex = /^(\d+):(\d+)$/;
  const scoreRegexMatch = stakeName.match(scoreRegex);
  if (scoreRegexMatch) {
    const leftScore = Number(scoreRegexMatch[1]);
    const rightScore = Number(scoreRegexMatch[2]);
    const digitsCount = Math.ceil(Math.log10(rightScore + 1));
    const result = Number(leftScore + rightScore / 10 ** digitsCount);
    return result;
  }

  return -6666;
};

export default getParameterFromCoupon;
