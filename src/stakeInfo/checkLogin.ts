const checkLogin = (): boolean => {
  return app && app.loggedIn && app.loggedIn();
};

export default checkLogin;
