const appLoaded = (): boolean => {
  // eslint-disable-next-line no-underscore-dangle
  return typeof app !== 'undefined' && app.lineManager && app._ready === true;
};

export default appLoaded;
