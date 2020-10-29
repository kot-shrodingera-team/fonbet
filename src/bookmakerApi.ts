interface FonbetEvent {
  _factors: {
    _factors: {
      [key: number]: FonbetLine;
    };
  };
  rootId: number;
  id: number;
}

interface FonbetLine {
  id: number;
  p: unknown;
}

interface FonbetStake {
  available: boolean;
  blocked: boolean;
  v: number;
  vNew: number;
  pt: string;
  ptNew: string;
  factorId: number;
  stakeName: string;
  eventName: string;
}

export interface FonbetCoupon {
  state: string;
  extra: {
    requestId: number;
  };
}

interface FonbetSettings {
  takeUpBets: boolean;
  takeChangedBets: boolean;
}

interface FonbetApi {
  accountManager: {
    needVerification: () => boolean;
  };
  lineManager: {
    _loaded: boolean;
    _eventDict: {
      [key: number]: FonbetEvent;
    };
  };
  loggedIn: () => boolean;
  session: {
    attributes: {
      liveBlocked: boolean;
      payBlocked: boolean;
    };
  };
  couponManager: {
    newCoupon: {
      stakeCount: number;
      clear: () => void;
      newAddStake: (
        e: string,
        t: string,
        eventRootId: number,
        eventId: number,
        lineId: number,
        lineP: unknown
      ) => void;
      stakes: FonbetStake[];
      amountMin: number;
      amountMax: number;
      amount: number;
      cloneCouponToPlace: (...args: unknown[]) => FonbetCoupon;
    };
    _list: FonbetCoupon[];
  };
  _ready: boolean;
  headerApi: {
    settings: () => FonbetSettings;
  };
  settingsApply: (fonbetSettings: FonbetSettings, settingName: string) => void;
}

declare global {
  const app: FonbetApi;
  interface Window {
    currentCoupon: FonbetCoupon;
  }
}

export default {};
