'use strict'

module.exports = function (sequelize, DataTypes) {
  // define our main user object
  let SeenUser = sequelize.define('SeenUser', {
    seenUserId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      auto_increment: true,
      field: 'seen_user_id'
    },
    channel: DataTypes.STRING,
    nick: DataTypes.STRING,
    lastSeen: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'last_seen'
    },
    action: DataTypes.STRING,
    createdOn: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_on'
    }
  }, {
    timestamps: false,
    underscored: true,
    tableName: 'seen_user',
    classMethods: {
      associate: function (models) {
        
      }
    }
  })

  return SeenUser
}