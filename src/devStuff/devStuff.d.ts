interface DevStuff {
  dontCheckBlocked: boolean;
  fake: boolean;
}

declare global {
  interface Window {
    devStuff: DevStuff;
  }
}

export {};
