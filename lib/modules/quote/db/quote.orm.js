'use strict'

module.exports = function (sequelize, DataTypes) {
  let Quote = sequelize.define('Quote', {
    quoteId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      auto_increment: true,
      field: 'quote_id'
    },
    content: { type: DataTypes.STRING, field: 'content' },
    channel: { type: DataTypes.STRING, field: 'channel' },
    createdOn: { type: DataTypes.DATE, field: 'created_on' }
  }, {
    timestamps: false,
    underscored: true,
    tableName: 'quote',
    classMethods: {
      associate: function (models) { // eslint-disable-line no-unused-vars
        
      }
    }
  })

  return Quote
}