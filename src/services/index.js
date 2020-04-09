const notification = require("./notification/notification.service.js");
const {
  ensureContract,
  watchCreateLock,
  insertDB,
} = require("./crawl/crawl.js");

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(notification);
  // const signal = {};
  ensureContract().then((c) => {
    watchCreateLock(c);
    // insertDB();
  });
  // insertDB();
};
