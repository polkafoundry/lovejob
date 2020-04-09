// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const notification = sequelizeClient.define('notification', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true
    },
    app: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    receiver: {
      type: DataTypes.STRING,
      allowNull: false
    },
    promise: {
      type: DataTypes.STRING,
      allowNull: false
    },
    event_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false,
    tableName: 'notification',
    indexes : [
      {
        unique: false,
        fields:['app', 'sender']
      },
      {
        unique: false,
        fields:['app', 'sender', 'receiver']
      },
      {
        unique: false,
        fields:['sender', 'receiver']
      },
      {
        unique: false,
        fields:['event_name']
      },
      {
        unique: false,
        fields:['created_at']
      }
    ]
  });

  return notification;
};
