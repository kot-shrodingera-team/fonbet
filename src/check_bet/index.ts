import WorkerBetObject from '@kot-shrodingera-team/worker-declaration/workerBetObject';
import { log } from '@kot-shrodingera-team/germes-utils';

const checkBet = (logInfo = false): boolean => {
  const error = (message: string): boolean => {
    log(message, 'crimson');
    return false;
  };
  const { stakeName, eventName, pt } = app.couponManager.newCoupon.stakes[0];
  const { market, odd, param, period, subperiod, overtimeType } = JSON.parse(
    worker.ForkObj
  ) as WorkerBetObject;

  if (logInfo) {
    const message =
      `Маркет: "${eventName.replace('%P', pt)}"\n` +
      `Ставка: "${stakeName}"\n` +
      `Роспись в боте: "${worker.BetName.trim()}"\n` +
      `${market}|${odd}|${param}|${period}|${subperiod}|${overtimeType}`;
    log(message, 'lightgrey');
  }

  if (worker.SportId === 2 && /^ML[12]$/i.test(odd) && subperiod) {
    const eventRegex = /^(\d+)-й сет (.*) – (.*)$/i;
    const eventMatch = eventName.match(eventRegex);
    if (!eventMatch) {
      return error('Маркет не соответствует победе в гейме сета');
    }
    const [set, teamOne, teamTwo] = eventMatch.slice(1);
    const stakeRegex = /^Гейм %P - (.*)$/i;
    const stakeMatch = stakeName.match(stakeRegex);
    const [team] = stakeMatch.slice(1);
    if (!stakeMatch) {
      return error('Ставка не соответствует победе в гейме сета');
    }
    if (Number(set) !== period) {
      return error('Открыта победа не на тот сет');
    }
    if (Number(pt) !== Number(subperiod)) {
      return error('Открыта победа не на тот гейм');
    }
    if (/^ML1$/i.test(odd) && team !== teamOne) {
      return error('Открыта победа 1');
    }
    if (/^ML2$/i.test(odd) && team !== teamTwo) {
      return error('Открыта победа 2');
    }
    return true;
  }

  if (/^(ML1|1)$/i.test(odd)) {
    if (!/^Поб 1/i.test(stakeName)) {
      return error('Открыта не победа 1');
    }
  }
  if (/^(ML2|2)$/i.test(odd)) {
    if (!/^Поб 2/i.test(stakeName)) {
      return error('Открыта не победа 2');
    }
  }
  if (/^X$/i.test(odd)) {
    if (!/^Ничья/i.test(stakeName)) {
      return error('Открыта не ничья');
    }
  }
  if (/^1X$/i.test(odd)) {
    if (!/^1X/i.test(stakeName)) {
      return error('Открыт не двойной шанс 1X');
    }
  }
  if (/^12$/i.test(odd)) {
    if (!/^12/i.test(stakeName)) {
      return error('Открыт не двойной шанс 12');
    }
  }
  if (/^X2$/i.test(odd)) {
    if (!/^X2/i.test(stakeName)) {
      return error('Открыт не двойной шанс X2');
    }
  }
  if (/^F1$/i.test(odd)) {
    if (!/^Фора 1/i.test(stakeName)) {
      return error('Открыта не фора на 1');
    }
  }
  if (/^F2$/i.test(odd)) {
    if (!/^Фора 2/i.test(stakeName)) {
      return error('Открыта не фора на 2');
    }
  }
  if (/^TU$/i.test(odd)) {
    if (!/</.test(stakeName)) {
      return error('Открыт не тотал меньше');
    }
  }
  if (/^TO$/i.test(odd)) {
    if (!/>/.test(stakeName)) {
      return error('Открыт не тотал больше');
    }
  }
  if (/^(Y|EVEN)$/i.test(odd)) {
    if (!/да/.test(stakeName)) {
      return error('Открыта не ставка "Да"');
    }
  }
  if (/^(N|ODD)$/i.test(odd)) {
    if (!/нет/.test(stakeName)) {
      return error('Открыта не ставка "Нет"');
    }
  }
  if (/^CS$/i.test(odd)) {
    if (!/^(\d+):(\d+)$/.test(stakeName)) {
      return error('Открыта не ставка на точный счёт');
    }
  }
  return true;
};

export default checkBet;
