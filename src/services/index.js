const notification = require("./notification/notification.service.js");
const { ensureContract, watchCreateLock } = require("./crawl/crawl.js");

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(notification);
  const signal = {};
  let sub;
  ensureContract().then((c) => {
    sub = watchCreateLock(app, c, signal);
  });
  console.log("sub", sub);
};
