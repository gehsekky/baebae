'use strict'

let fs = require('fs')
let config = require('config')
let Sequelize = require('sequelize')
let db = {}

// initialize database connection
let sequelize = new Sequelize(
  config.get('modules.seen.database'),
  config.get('modules.seen.username'),
  config.get('modules.seen.password'),
  config.get('modules.seen.opts')
)

// load every .orm.js file in this directory
fs.readdir(__dirname, (err, files) => {
  let models = files.filter(file => {
    return file.indexOf('.orm.js') !== -1
  })

  for (let modelFile of models) {
    let model = sequelize.import('./' + modelFile)
    db[model.name] = model
  }
})

// wire up model associations (relationships)
Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

// cache the connection and main Sequelize object
// and return along with models
db.sequelize = sequelize
db.Sequelize = Sequelize

// export connection
module.exports = db