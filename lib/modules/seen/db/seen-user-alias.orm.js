'use strict'

module.exports = function (sequelize, DataTypes) {
  // define our main user object
  const SeenUserAlias = sequelize.define('SeenUserAlias', {
    channel: {
      type: DataTypes.STRING,
      unique: 'primaryKey',
      field: 'channel',
      primaryKey: true
    },
    seenUserId: {
      type: DataTypes.INTEGER,
      unique: 'primaryKey',
      field: 'seen_user_id',
      primaryKey: true
    },
    aliasId: {
      type: DataTypes.INTEGER,
      unique: 'primaryKey',
      field: 'alias_id',
      primaryKey: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    timestamps: false,
    underscored: true,
    tableName: 'seen_user_alias',
    classMethods: {
      associate: function (models) {
        SeenUserAlias.belongsTo(
          models.SeenUser,
          { foreignKey: 'seen_user_id' }
        )

        SeenUserAlias.belongsTo(
          models.SeenUser,
          { as: 'Alias', foreignKey: 'seen_user_id' }
        )
      }
    }
  })

  return SeenUserAlias
}