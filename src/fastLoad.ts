import { log, checkUrl } from '@kot-shrodingera-team/germes-utils';
import { version } from '../package.json';
import showStake from './show_stake';
import { clearMinimumStake } from './stake_info/getMinimumStake';
import { clearMaximumStake } from './stake_info/getMaximumStake';

const fastLoad = async (): Promise<void> => {
  log(`Быстрая загрузка (${version})`, 'steelblue');
  if (!checkUrl()) {
    log(
      `Не на сайте БК (${window.location.host}). Переходим на ${worker.BookmakerMainUrl}`,
      'orange'
    );
    window.location.href = new URL(worker.BookmakerMainUrl).href;
    return;
  }
  const { pathname } = window.location;
  if (!pathname.startsWith('/live') && !pathname.startsWith('/bets')) {
    log('Не на странице линии или лайва. Переходим на лайв', 'orange');
    window.location.href = new URL('/live', worker.BookmakerMainUrl).href;
    return;
  }
  clearMinimumStake();
  clearMaximumStake();
  showStake();
};

export default fastLoad;
