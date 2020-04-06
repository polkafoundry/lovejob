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
    user: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    txid: {
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
        fields:['app', 'user']
      },
      {
        unique: false,
        fields:['app', 'user', 'type']
      },
      {
        unique: false,
        fields:['user', 'type']
      },
      {
        unique: false,
        fields:['txid']
      },
      {
        unique: false,
        fields:['created_at']
      }
    ]
  });

  return notification;
};
