import './workerCheck';
import './bookmakerApi';
import { sleep } from '@kot-shrodingera-team/config/util';
import getStakeInfo from './callbacks/getStakeInfo';
import setStakeSum from './callbacks/setStakeSum';
import doStake from './callbacks/doStake';
import checkCouponLoading from './callbacks/checkCouponLoading';
import checkStakeStatus from './callbacks/checkStakeStatus';
import authorize from './authorize';
import showStake from './showStake';
import clearStakeData from './stakeData/clearStakeData';
import clearDevStuff from './devStuff/clearDevStuff';

clearStakeData();
clearDevStuff();

const FastLoad = async (): Promise<void> => {
  worker.Helper.WriteLine('Быстрая загрузка');
  clearStakeData();
  if (window.location.pathname !== '/live/') {
    worker.Helper.WriteLine('Переходим на лайв');
    window.location.href = `${window.location.origin}/live/`;
    return;
  }
  showStake();
};

worker.SetCallBacks(
  console.log,
  getStakeInfo,
  setStakeSum,
  doStake,
  checkCouponLoading,
  checkStakeStatus
);
worker.SetFastCallback(FastLoad);

(async (): Promise<void> => {
  worker.Helper.WriteLine('Начали');
  // await domLoaded();
  await sleep(3000);
  // console.log('DOM загружен');
  if (!worker.IsShowStake) {
    authorize();
  } else {
    showStake();
  }
})();
