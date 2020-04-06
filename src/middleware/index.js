// eslint-disable-next-line no-unused-vars
const { ecc } = require("@iceteachain/common");
const { NotAuthenticated, GeneralError } = require('@feathersjs/errors');
const { isAuthorized } = require("./authorize");

module.exports = function (app) {
  // Add your custom middleware here. Remember that
  // in Express, the order matters.
  var auth = async function (req, res, next) {
    const authData = req.headers.authorization.slice(7);
    const {app, from, pubkey, sign, time} = JSON.parse(authData);
    // first, check if require is not expired
    if (Date.now() - time > app.get('expired_duration')) {
      return new NotAuthenticated('The request is no longer valid.');
    }

    // check if user is approved
    const tokenAddress = ecc.toAddress(pubkey);
    try {
      const isApprovedUser = await isAuthorized(app, from, tokenAddress);
      if (!isApprovedUser) {
        return new NotAuthenticated('Not an approved account or out of quota.');
      }
    } catch (e) {
      console.error(e)
      return GeneralError('Error checking permission.');
    }
    next();
  };
  app.use(auth);
};
