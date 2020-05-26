const checkBet = (log = false): boolean => {
  const error = (message: string): boolean => {
    worker.Helper.WriteLine(message);
    return false;
  };
  const { stakeName, eventName } = app.couponManager.newCoupon.stakes[0];
  const { market, odd, param, period, subperiod, overtimeType } = JSON.parse(
    worker.ForkObj
  ) as WorkerBetObject;

  if (log) {
    worker.Helper.WriteLine(`Событие '${eventName}'`);
    worker.Helper.WriteLine(`Ставка '${stakeName}'`);
    worker.Helper.WriteLine(`Роспись в боте '${worker.BetName}'`);
    worker.Helper.WriteLine(
      `market: ${market}, odd: ${odd}, param: ${param}, period: ${period}, subperiod: ${subperiod}, overtimeType: ${overtimeType}`
    );
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
    if (!/^1/i.test(stakeName)) {
      return error('Открыта не фора на 1');
    }
  }
  if (/^F2$/i.test(odd)) {
    if (!/^2/i.test(stakeName)) {
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
