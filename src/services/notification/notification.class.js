const { NotImplemented } = require('@feathersjs/errors');
const { Service } = require('feathers-sequelize');
const  notImplemented = new NotImplemented('This method doesn\'t exists');

exports.Notification = class Notification extends Service {
  find(params) {
    const deleteRead = params.deleteRead ? params.deleteRead : this.options.paginate;
    var findPromise =  super.find(params);
    //remove delete read notification
    findPromise.then(rs => {
      
    });
    return findPromise;
  }

  create(data, params) {
    return Promise.reject(notImplemented);
  }
  update(id, data, params) {
    return Promise.reject(notImplemented);
  }
  patch(id, data, params) {
    return Promise.reject(notImplemented);
  }
  remove(id, params) {
    return Promise.reject(notImplemented);
  }
};
