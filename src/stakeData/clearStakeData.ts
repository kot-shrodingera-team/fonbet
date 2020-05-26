const clearStakeData = (): void => {
  window.stakeData = {
    currentCoupon: null,
    isNewMin: false,
    newMinValue: 0,
    isNewMax: false,
    newMaxValue: 0,
    badMirrorSendMessage: false,
  };
};

export default clearStakeData;
