import {
  log,
  correctScoreParameter,
  getWorkerParameter,
} from '@kot-shrodingera-team/germes-utils';

const getParameter = (): number => {
  if (
    getWorkerParameter('fakeParameter') ||
    getWorkerParameter('fakeOpenStake')
  ) {
    const parameter = Number(JSON.parse(worker.ForkObj).param);
    if (Number.isNaN(parameter)) {
      return -6666;
    }
    return parameter;
  }

  if (
    typeof app === 'undefined' ||
    !app.couponManager ||
    !app.couponManager.newCoupon ||
    !app.couponManager.newCoupon.stakes ||
    !app.couponManager.newCoupon.stakes[0]
  ) {
    log('Ошибка определения параметра: не найдена ставка', 'crimson');
    return -9999;
  }
  const parameterString = app.couponManager.newCoupon.stakes[0].pt;
  const parameter = Number(parameterString);

  if (parameterString !== undefined) {
    if (Number.isNaN(parameter)) {
      log(
        `Ошибка определения параметра: некорректный формат параметра: "${parameter}"`,
        'crimson'
      );
      return -6666;
    }
    return parameter;
  }

  // Некоторые исходы могут восприниматься как Тоталы 0.5

  // 1 забьёт
  // 4235 - да
  // 4236 - нет

  // 2 забьёт
  // 4238 - да
  // 4239 - нет

  // Никто не забьёт
  // 4253 - да
  // 4254 - нет

  // Так что явно возвращаем 0.5
  if (
    [4235, 4236, 4238, 4239, 4253, 4254].includes(
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
    return correctScoreParameter(leftScore, rightScore);
  }

  return -6666;
};

export default getParameter;
