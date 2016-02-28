'use strict'

module.exports = function (sequelize, DataTypes) {
  let Quote = sequelize.define('Quote', {
    quoteId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      auto_increment: true,
      field: 'quote_id'
    },
    content: { type: DataTypes.STRING, field: 'content' }
  }, {
    timestamps: false,
    underscored: true,
    tableName: 'quote',
    classMethods: {
      associate: function (models) {
        
      }
    }
  })

  return Quote
}