import { log } from '@kot-shrodingera-team/germes-utils';

const setBetAcceptMode = async (): Promise<void> => {
  const set = app.headerApi.settings();
  if (worker.StakeAcceptRuleShoulder === 0) {
    log(
      'Устанавливаем режим принятия ставок только с текущим коэффициентом',
      'orange'
    );
    set.takeUpBets = false;
    set.takeChangedBets = false;
  } else if (worker.StakeAcceptRuleShoulder === 1) {
    log(
      'Устанавливаем режим принятия ставок с повышением коэффициента',
      'orange'
    );
    set.takeUpBets = true;
    set.takeChangedBets = false;
  } else if (worker.StakeAcceptRuleShoulder === 2) {
    log(
      'Устанавливаем режим принятия ставок с любым изменением коэффициента',
      'orange'
    );
    set.takeUpBets = true;
    set.takeChangedBets = true;
  }
  try {
    app.settingsApply(set, 'takeUpBets');
  } catch {
    //
  }
  try {
    app.settingsApply(set, 'takeChangedBets');
  } catch {
    //
  }
};

export default setBetAcceptMode;
