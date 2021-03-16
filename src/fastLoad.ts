import { log } from '@kot-shrodingera-team/germes-utils';
import { version } from '../package.json';
import showStake from './show_stake';

const clearGermesData = () => {
  window.germesData = {
    betProcessingStep: undefined,
    betProcessingAdditionalInfo: undefined,
    doStakeTime: undefined,
    limits: {
      minimumStake: undefined,
      maximumStake: undefined,
    },
    currentBet: {
      eventName: undefined,
      betName: undefined,
      lastSameBetCount: undefined,
    },
  };
};

const fastLoad = async (): Promise<void> => {
  log(`Быстрая загрузка (${version})`, 'steelblue');
  clearGermesData();
  showStake();
};

export default fastLoad;
