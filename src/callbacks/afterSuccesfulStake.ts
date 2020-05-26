// function sendAnalyticsData(sumStaked, coefficient, balanceAvailable, balanceStaked) {
//     let body = {
//         fork_id: worker.ForkId,
//         fork_random_id: worker.ForkRandomId,
//         api_key: worker.ApiKey,
//         vds_ip: worker.VdsIp,
//         bookmaker_id: worker.BookmakerId,
//         stake: {
//             shoulder_number: worker.ShoulderNumber,
//             sum: sumStaked,
//             minimum_sum: worker.StakeInfo.MinSumm,
//             maximumSum: worker.StakeInfo.MaxSumm,
//             coefficient: coefficient,
//             currency: worker.Currency,
//             currency: worker.CurrencyRate
//         },
//         balance_available: balanceAvailable,
//         balance_staked: balanceStaked
//     }
//     fetch('https://strike.ws/test_post.php', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'text/plain'
//         },
//         body: body
//     });
// }

// async function getBalanceStaked() {
//     location.assign('https://www.fonbet.ru/#!/account/history/bets');
//     let betHistoryRangeButton = await getElement('[class^="Select__text"]');
//     betHistoryRangeButton.click();
//     let threeMonthsItem = Array.from(document.querySelectorAll('[class^="SelectItem"]')).find(item => item.textContent === 'За три месяца');
//     threeMonthsItem.click();
//     let stakeTypes = document.querySelectorAll('.ui__checkbox-item');
//     stakeTypes.forEach(stakeType => {
//         let checkbox = stakeType.querySelector('input[type="checkbox"]');
//         if (stakeType.textContent === 'Не рассчитана' && !checkbox.checked) {
//             checkbox.checked = true;
//         }
//         if (stakeType.textContent !== 'Не рассчитана' && checkbox.checked) {
//             console.log('uncheck');
//             checkbox.checked = false;
//             console.log(checkbox.checked);
//         }
//     });
//     // try {
//     //     app.couponManager.couponList.filter(coupon => coupon.state === 'register').reduce((sumStaked, coupon) => sumStaked += coupon.sum / 100, 0);
//     // } catch (e) {
//     //     console.log(`Ошибка получения суммы нерасчитанных ставок - ${e}`);
//     //     return -1;
//     // }
// }

// function getLastStakeSum() {
//     try {
//         return window.app.couponManager.newCoupon.manager._list[0].sum / 100;
//     } catch (e) {
//         console.log(`Ошибка получения суммы последней ставки - ${e}`);
//         return -1;
//     }
// }

// function getLastStakeCoefficient() {
//     try {
//         return window.app.couponManager.newCoupon.manager._list[0].bets[0].factorValue;
//     } catch (e) {
//         console.log(`Ошибка получения коэффициента последней ставки - ${e}`);
//         return -1;
//     }
// }

// function afterSuccesfulStake() {
//     let sumStaked = getLastStakeSum();
//     let coefficient = getLastStakeCoefficient();
//     let balanceAvailable = getBalance();
//     let balanceStaked = getBalanceStaked();
//     sendAnalyticsData(sumStaked, coefficient, balanceAvailable, balanceStaked);
// }
