import { log } from '@kot-shrodingera-team/germes-utils';

const checkStakeStatus = (): boolean => {
  if (window.germesData.betProcessingStep === 'success') {
    log('Ставка принята', 'green');
    return true;
  }
  log('Ставка не принята', 'red');
  return false;
};

export default checkStakeStatus;
