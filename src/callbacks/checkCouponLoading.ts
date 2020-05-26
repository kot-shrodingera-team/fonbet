/* eslint-disable no-underscore-dangle */
const checkCouponLoading = (): boolean => {
  if (window.devStuff.fake) {
    return false;
  }
  const { currentCoupon } = window.stakeData;
  if (currentCoupon.state === 'progress') {
    try {
      if (
        currentCoupon.extra.requestId ===
          app.couponManager._list[0].extra.requestId &&
        app.couponManager._list[0].state !== 'progress'
      ) {
        worker.Helper.WriteLine('Ставка в списке принятых');
        return false;
      }
    } catch (e) {
      //
    }
    worker.Helper.WriteLine('Обработка ставки');
    return true;
  }
  worker.Helper.WriteLine(
    `Обработка ставки завершена (${currentCoupon.state})`
  );
  return false;
};

export default checkCouponLoading;
