const users = require('./users/users.service.js');
const notification = require('./notification/notification.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(notification);
};
