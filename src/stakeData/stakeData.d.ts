interface StakeData {
  currentCoupon: FonbetCoupon;
  isNewMin: boolean;
  newMinValue: number;
  isNewMax: boolean;
  newMaxValue: number;
  badMirrorSendMessage: boolean;
}

declare global {
  interface Window {
    stakeData: StakeData;
  }
}

export {};
