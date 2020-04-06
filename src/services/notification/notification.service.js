// Initializes the `notification` service on path `/notification`
const { Notification } = require('./notification.class');
const createModel = require('../../models/notification.model');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    deleteRead: app.get('delete_read_notification')
  };

  // Initialize our service with any options it requires
  app.use('/notification', new Notification(options, app));
};
